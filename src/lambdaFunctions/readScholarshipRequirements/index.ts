import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { AWSRequest, AWSResponse } from '../types/aws';


const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Reads scholarship requirement data from the scholarship info table.
 * @param {string} event - The scholarship ID
 * @returns The scholarship requirement information
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input = JSON.parse(event.body);

  const command = new GetItemCommand({
    TableName: "scholarship-info",
    Key: {
      scholarshipId: {S: input.scholarshipId}
    },
    AttributesToGet: [
      "studentAidReport",
      "studentInterviews",
      "recipientSelection",
      "transcriptRequirement",
      "awardTo",
      "sclshpReApplication",
      "essayRequirement",
      "essaySelection",
      "awardNightRemarks"
    ]
  });

  const dbresponse = await client.send(command);

  if (!dbresponse.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify("Item not found")
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(dbresponse.Item)
  };
}
