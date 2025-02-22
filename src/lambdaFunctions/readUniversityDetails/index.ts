import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { AWSRequest, AWSResponse } from '../types/aws';


const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Reads university details data from the ___ table
 * @param {string} event -
 * @returns university details information
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input = JSON.parse(event.body);

  const command = new GetItemCommand({
    TableName: "",
    Key: {
      //key
    },
    AttributesToGet: [
      "universityDetails",
      "universityName",
      "universityState",
      "universityCity",
      "universityZipCode",
      "studentsMajor",
      "studentStudyField",
      "studentCareer",
      "universityAcceptance",
      "tuitionCost",
      "roomBoard",
      "travelCosts",
      "miscCosts"
    ]
  });

  // Send the command
  const dbresponse = await client.send(command);

  // Check that there is an item in the response
  if (!dbresponse.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify("Item not found")
    };
  }

  // Return the item's information
  return {
    statusCode: 200,
    body: JSON.stringify(dbresponse.Item)
  };
}
