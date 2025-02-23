import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import {AWSRequest, AWSResponse, InstitutionalResources, StudentPersonalInfo} from "./../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the student applications table in DynamoDB
 * @param {AWSRequest} event - Request that contains an institutional resources object.
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {

  const institutionalInfo: InstitutionalResources = JSON.parse(event.body);

  // Create variable for the student table IDs corresponding cookie
  const studentEmail = event.headers.Cookie.match(/studentEmail=([^;]*)/)[1];

  // Create a command to update everything that may be entered in the institutional resources form
  const command = new UpdateItemCommand({
    TableName: "student-applications",
    Key: {
      studentEmail: {S: studentEmail}
    },
    ExpressionAttributeNames: {
      "#grantsAwarded": "grantsAwarded",
      "#totalSelfHelp": "totalSelfHelp",
      "#loansValue": "loansValue"
    },
    ExpressionAttributeValues: {
      ":grantsAwarded": {S: institutionalInfo.grantsAwarded},
      ":totalSelfHelp": {S: institutionalInfo.totalSelfHelp},
      ":loansValue": {S: institutionalInfo.loansValue}
    },
    UpdateExpression: "SET #grantsAwarded = :grantsAwarded," +
      "#totalSelfHelp = :totalSelfHelp," +
      "#loansValue = :loansValue"
  });

  try {
    // Send the command
    const dbresponse = await client.send(command);

    // Return that there was a success
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };

  } catch (e) {
    console.error(e.message);
    // Return that there was an error
    return {
      statusCode: 400,
      body: JSON.stringify({ message: e.message }),
    }
  }
}

