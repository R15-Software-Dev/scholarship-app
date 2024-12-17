import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { AWSRequest, AWSResponse } from '../types/aws';


const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Reads scholarship data from the scholarship info table.
 * @param {string} event - The scholarship ID
 * @returns The scholarship information
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {

  const input: string = JSON.parse(event.body);

  const command = new GetItemCommand({
    TableName: "scholarship-info",
    Key: {
      Name: { S: input }
    },
    AttributesToGet: [
      "sclshpTitle",
      "sclshpSponsor",
      "sclshpNumAwards",
      "sclshpAwardsTotal",
      "sclshpAmountPerAward"
    ]
  });

  const dbresponse = await client.send(command);

  if (!dbresponse.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Scholarship not found" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(dbresponse.Item)
  };
}
