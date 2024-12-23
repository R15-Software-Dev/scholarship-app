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

  // Create a command to get a scholarship's info for the eligibility form.
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

  // Send the command
  const dbresponse = await client.send(command);

  // Check that there is an item in the response
  if (!dbresponse.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Scholarship not found" })
    };
  }

  // Return the item's information
  return {
    statusCode: 200,
    body: JSON.stringify(dbresponse.Item)
  };
}
