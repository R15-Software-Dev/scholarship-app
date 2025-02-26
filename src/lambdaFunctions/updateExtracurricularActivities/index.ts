import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import {AWSRequest, AWSResponse, ExtracurricularActivities } from "./../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the student applications table in DynamoDB
 * @param {AWSRequest} event - Request that contains an extracurricular activities object
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {

  const extracurricularInfo: ExtracurricularActivities = JSON.parse(event.body);

// Get student email from the passed cookie header
  const studentEmail = event.headers.Cookie.match(/studentEmail=([^;]*)/)[1];

  // Create a command to update everything that may be entered in the extracurricular activities form
  const command = new UpdateItemCommand({
    TableName: "student-applications",
    Key: {
      Email: {S: studentEmail}
    },
    ExpressionAttributeNames: {
      "#extraActivity": "extraActivity",
      "#extraActivityParticipated": "extraActivityParticipated",
      "#extraActivityHours": "extraActivityHours",
      "#extraWeeksParticipated": "extraWeeksParticipated",
      "#extraSpecialInvolvement": "extraSpecialInvolvement"
    },
    ExpressionAttributeValues: {
      ":extraActivity": {S: extracurricularInfo.extraActivity},
      ":extraActivityParticipated": {S: extracurricularInfo.extraActivityParticipated},
      ":extraActivityHours": {N: extracurricularInfo.extraActivityHours.toString()},
      ":extraWeeksParticipated": {N: extracurricularInfo.extraWeeksParticipated.toString()},
      ":extraSpecialInvolvement": {S: extracurricularInfo.extraSpecialInvolvement}
    },
    UpdateExpression: "SET #extraActivity = :extraActivity," +
      "#extraActivityParticipated = :extraActivityParticipated," +
      "#extraActivityHours = :extraActivityHours," +
      "#extraWeeksParticipated = :extraWeeksParticipated," +
      "#extraSpecialInvolvement = :extraSpecialInvolvement"

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

