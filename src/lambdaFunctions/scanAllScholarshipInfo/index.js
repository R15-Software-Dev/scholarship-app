import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const command = new ScanCommand({
    TableName: "scholarship-info",
    Select: "ALL_ATTRIBUTES"
  });

  try {
    const dbresponse = await client.send(command);
  } catch (e) {
    console.error(e.message);
    throw new Error(e.message);
  }
}
