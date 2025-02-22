import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { AWSRequest, AWSResponse } from '../types/aws';


const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Reads family data from the ___ table
 * @param {string} event - The student ID
 * @returns family information
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input: string = JSON.parse(event.body);

  const command = new GetItemCommand({
    TableName: "",
    Key: {
      //Key
    },
    AttributesToGet: [
      "numChildTotal",
      "numChildAttendCollege",
      "guardianOneName",
      "guardianOneRelation",
      "guardianOneOccupation",
      "guardianOneEmployer",
      "guardianTwoName",
      "guardianTwoRelation",
      "guardianTwoOccupation",
      "guardianTwoEmployer",
      "familyPEAMember",
      "armedServiceMember",
      "familyChurchMember"
    ]
  });

  // Send the command
  const dbresponse = await client.send(command);

  // Check that there is an item in the response
  if (!dbresponse.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Item not found" })
    };
  }

  // Return the item's information
  return {
    statusCode: 200,
    body: JSON.stringify(dbresponse.Item)
  };
}