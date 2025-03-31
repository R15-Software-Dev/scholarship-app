import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { ResourceNotFoundException } from "@aws-sdk/client-cognito-identity-provider";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  return new Promise<APIGatewayProxyResult>((resolve, reject) => {
    // Parse the event and find the proxy value.
    console.log(event.pathParameters);

    if (event.pathParameters) {
      console.log(
        "Getting information for student with id " +
          event.pathParameters.studentid,
      );

      const command = new GetItemCommand({
        TableName: "student-applications",
        Key: {
          Email: { S: event.pathParameters.studentid },
        },
      });

      client
        .send(command)
        .then((dbresponse) => {
          if (dbresponse.Item) {
            // Return the information to the client
            resolve({
              statusCode: 200,
              body: JSON.stringify(dbresponse.Item),
            });
          } else {
            throw new ResourceNotFoundException({$metadata: undefined, message: "Database returned null"});
          }
        })
        .catch((e) => {
          // Some error happened in the database request. Handle it.
          console.error(e);
          if (e instanceof ResourceNotFoundException) {
            // We didn't find the requested studentid
            reject({
              statusCode: 404,
              body: JSON.stringify({
                message:
                  "Couldn't find student with id " +
                  event.pathParameters.studentid,
              }),
            });
          } else {
            reject({
              statusCode: 500,
              body: JSON.stringify({
                message: "An error occurred",
                error: e,
              }),
            });
          }
        });
    } else {
      resolve({
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing path parameters",
        }),
      });
    }
  });
};
