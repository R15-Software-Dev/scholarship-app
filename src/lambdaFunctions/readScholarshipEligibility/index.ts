import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { AWSRequest, AWSResponse } from '../types/aws';


const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Reads scholarship eligibility data from the scholarship info table.
 * @param {string} event - The scholarship name
 * @returns The scholarship eligibility information
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input: string = JSON.parse(event.body);

  const command = new GetItemCommand({
    TableName: "scholarship-info",
    Key: {
      Name: { S: input }
    },
    AttributesToGet: [
      "studentResidence",
      "sclshpNonPHS",
      "studyAreaRequirement",
      "financialNeed",
      "eligibilityOther"
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
