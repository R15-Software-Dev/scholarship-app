import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";


const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
    try {
        const command = new ScanCommand({
          TableName: "test-table",
          Select: "ALL_ATTRIBUTES"
        });

        const dbresponse = await client.send(command);
        return dbresponse;
      } catch (e) {
        console.error(e.message);
        throw new Error(e.message);
      }
};


