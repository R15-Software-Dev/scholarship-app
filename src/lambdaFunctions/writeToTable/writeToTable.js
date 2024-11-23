import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({ region: "us-east-1" });

// Designed for use with a POST request.
export async function handler(event) {
  try {
    const input = JSON.parse(event.body);

    // if (!event.body.email) throw new Error("Primary key was not included in POST.");
    if (!input.email) throw new Error("Primary key not found.");

    const command = new PutItemCommand({
      TableName: "test-table",
      Item: {
        emailAddress: { S: input.email },
        firstName: { S: input.firstName ? input.firstName : "" },
        lastName: { S: input.lastName ? input.lastName : "" },
      }
    });

    const dbresponse = await client.send(command);
    return buildResponse(dbresponse.$metadata.httpStatusCode, dbresponse);
  } catch (e) {
    console.log("Error: " + JSON.stringify(e));
    return buildResponse(500, {ErrorMessage: e.message, EventBody: event.body});
  }
}

const buildResponse = (statusCode, bodyContent) => {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "https://alphafetus-testbucket.s3.amazonaws.com",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    },
    body: JSON.stringify(bodyContent)
  };
};
