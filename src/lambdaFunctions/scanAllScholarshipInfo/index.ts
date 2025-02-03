import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { AWSResponse } from "../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

export async function handler(event: any): Promise<AWSResponse> {

  const command = new ScanCommand({
    TableName: "scholarship-info",
    Select: "ALL_ATTRIBUTES"
  });

  try {
    const dbresponse = await client.send(command);
  } catch (e) {
    console.error(e.message);
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success"
    })
  };
}
