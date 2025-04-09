import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { ResourceNotFoundException } from "@aws-sdk/client-cognito-identity-provider";
import { Readable } from "stream";

const s3Client = new S3Client({});
const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract studentId from path parameters
    if (!event.pathParameters || !event.pathParameters.studentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing studentId in path parameters" })
      };
    }

    const Email = event.pathParameters.studentId;

    // Get the student record from DynamoDB
    const dbCommand = new GetItemCommand({
      TableName: process.env.TABLE_NAME || "student-applications",
      Key: {
        Email: { S: Email }
      }
    });

    const dbResponse = await dynamoClient.send(dbCommand);

    if (!dbResponse.Item) {
      throw new ResourceNotFoundException({
        $metadata: undefined,
        message: "Student not found"
      });
    }

    // Get the filename from DynamoDB
    const fileName = dbResponse.Item.studentFafsaKey?.S;
    if (!fileName) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No FAFSA submission found for this student"
        })
      };
    }

    // Get object from S3
    const s3Command = new GetObjectCommand({
      Bucket: "r15-student-data",
      Key: `fafsaSubmission/${fileName}`,
    });

    const s3Response = await s3Client.send(s3Command);

    // const thing = await s3Response.Body.transformToString();

    // Convert the stream to base64
    // const buffer = await streamToBuffer(s3Response.Body.transformToWebStream());
    const buffer = Buffer.from(await s3Response.Body.transformToByteArray());

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Content-Length': Buffer.byteLength(buffer)
      },
      isBase64Encoded: true,
      body: buffer.toString('base64')
    };

  } catch (error) {
    console.error("Error retrieving FAFSA submission:", error);

    if (error instanceof ResourceNotFoundException) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Couldn't find student with provided ID`
        })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving file",
        error: error instanceof Error ? error.message : String(error)
      })
    };
  }
};


const streamToBuffer = async (stream: ReadableStream): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    const chunks: any[] = [];
    // stream.on('data', (chunk: any) => chunks.push(chunk));
    // stream.on('end', () => resolve(Buffer.concat(chunks)));
    // stream.on('error', reject);
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    resolve(Buffer.concat(chunks));
  })
}