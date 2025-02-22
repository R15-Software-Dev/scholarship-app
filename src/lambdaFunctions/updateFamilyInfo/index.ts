import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse, ScholarshipContactInfo } from "./../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 *
 * @param event -
 * @returns
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {

  const /*family*/info /*studentFamilyInfo*/ = JSON.parse(event.body);

  // Create variable for the student table IDs corresponding cookie

  // Create a command to update everything that may be entered in the family info form
  const command = new UpdateItemCommand({
    TableName: "",
    Key: {
      //Key
    },

  });


  try {
    // Send the command
    const dbresponse = await client.send(command);

  } catch (e) {
    console.error(e.message);
    // Return that there was an error
    return {
      statusCode: 400,
      body: JSON.stringify({ message: e.message }),
    }
  }

  // Return that there was a success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
}
