import {DynamoDBClient, GetItemCommand} from '@aws-sdk/client-dynamodb';
import { AWSRequest, AWSResponse } from '../types/types';

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Reads scholarship provider contact data from the scholarship info table.
 * @param {string} event - The scholarship ID
 * @returns The scholarship provider contact information
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input = JSON.parse(event.body);

  // Create a command to get the scholarship's info for the contact info form.
  const command = new GetItemCommand({
    TableName: "scholarship-info",
    Key: {
      scholarshipId: {S: input.scholarshipId}
    },
    AttributesToGet: [
      "contact",
      "contactBusiness",
      "address",
      "homePhone",
      "businessPhone",
      "cellPhone",
      "email"
    ]
  });

  // Send the command
  const dbresponse = await client.send(command);

  // Check that there is an item in the response.
  if (!dbresponse.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({message: "Scholarship not found"})
    };
  }

  // Return the item's information
  return {
    statusCode: 200,
    body: JSON.stringify(dbresponse.Item)
  };
}
