import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({ region: "us-east-1" });

// Designed for use with a POST request.
export async function handler(event) {

  try {

    const input = JSON.parse(event.body);

    console.log("Creating command");
    const command = new GetItemCommand({
      TableName: "test-table",
      Key: {
        emailAddress: { S: input.email }
      }
    });

    const dbresponse = await client.send(command);
    return dbresponse;
  } catch (e) {
    console.error(e.message);
    throw new Error(e.message);
  }
}
