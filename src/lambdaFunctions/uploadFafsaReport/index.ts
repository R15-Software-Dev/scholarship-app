import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {DynamoDBClient, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import Busboy from "busboy";


const s3client = new S3Client({});
const dbclient = new DynamoDBClient({});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return new Promise<APIGatewayProxyResult>((resolve, reject) => {
    try {
      if (event.body) {
        const lowerHeaders = Object.keys(event.headers || {}).reduce((acc, key) => {
          acc[key.toLowerCase()] = event.headers![key];
          return acc;
        }, {} as Record<string, string>);

        const boy = Busboy({headers: lowerHeaders});
        const studentUser = event.headers.Cookie.match(/.*studentEmail=[^;]*/)[1];
        let _buffer: Buffer | null = null;
        let _fileName = `${studentUser}_fafsaSubmission.pdf`;
        let _contentType = "";

        // This event fires when the busboy finds a file in the body stream.
        boy.on("file", (fieldName, fileStream, info) => {
          console.log("Running file event.")
          const {filename, encoding, mimeType} = info;
          _contentType = mimeType;

          const chunks: Buffer[] = [];
          fileStream.on('data', (chunk: Buffer) => {
            console.log("adding chunk");
            chunks.push(chunk);
          });

          fileStream.on('end', () => {
            _buffer = Buffer.concat(chunks);
          });
        });

        // This only fires when the busboy runs into an error.
        boy.on('error', (err: Error) => {
          console.error("Busboy error: ", err)
          reject({
            statusCode: 500,
            body: JSON.stringify(err)
          });
        });

        // Cleanup event.
        boy.on("finish", async () => {
          console.log("Running finish event");
          if (!_buffer) {
            resolve({
              statusCode: 400,
              body: JSON.stringify({message: 'No file was uploaded'})
            });
          } else {
            const command: PutObjectCommand = new PutObjectCommand({
              Bucket: process.env.BUCKET_NAME,
              Key: `fafsaSubmission/${_fileName}`,
              Body: _buffer,
              ContentType: _contentType
            });
            const dbcommand: UpdateItemCommand = new UpdateItemCommand({
              TableName: process.env.TABLE_NAME,
              Key: {
                Email: { S: studentUser }
              },
              ExpressionAttributeNames: {
                "#studentFafsaKey": "studentFafsaKey"
              },
              ExpressionAttributeValues: {
                ":studentFafsaKey": { S: _fileName }
              },
              UpdateExpression: "SET #studentFafsaKey = :studentFafsaKey"
            });

            try {
              await s3client.send(command);
            } catch (error) {
              console.log("S3 Client error: ", error);
              reject({
                statusCode: 500,
                body: JSON.stringify(error)
              })
            }
            
            try {
              await dbclient.send(dbcommand);
              resolve({
                statusCode: 200,
                body: JSON.stringify({
                  message: 'Success',
                  _fileName,
                  _contentType
                })
              });
            } catch (error) {
              console.error("Dynamo client error: ", error);
              reject({
                statusCode: 500,
                body: JSON.stringify(error)
              })
            }
          }
        });

        // The body must be put into a buffer first, then sent through the busboy.
        // This must also happen *after* all the events are defined, because this is an async function.
        // Processing will miss events if the body isn't passed after all the events are set up.
        const body = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
        boy.end(body);
      } else {
        reject({
          statusCode: 500,
          body: JSON.stringify({
            message: "There was no request body"
          })
        });
        return;
      }
    } catch (error) {
      console.error(error);
      reject({
        statusCode: 500,
        body: JSON.stringify(error)
      });
    }
  });
}
