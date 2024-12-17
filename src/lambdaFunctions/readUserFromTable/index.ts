import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { AWSRequest, AWSResponse } from '../types/aws';


const client = new DynamoDBClient({ region: "us-east-1" });

// Designed for use with a POST request.
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input = JSON.parse(event.body);

  console.log("Creating command");
  const command = new GetItemCommand({
    TableName: "test-table",
    Key: {
      emailAddress: { S: input.email }
    }
  });

  const dbresponse = await client.send(command);

  if (!dbresponse.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Item not found" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(dbresponse)
  };
}
