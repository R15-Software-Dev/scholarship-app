import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import {AWSRequest, AWSResponse, UniversityDetails } from "./../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the student applications table in DynamoDb
 * @param {AWSRequest} event - Request that contains a university details object.
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {

  const universityInfo: UniversityDetails = JSON.parse(event.body);

  // Get the student email from the corresponding cookie
  const studentEmail = event.headers.Cookie.match(/studentEmail=([^;]*)/)[1];

  // Create a command to update everything that may be entered in the university details form
  const command = new UpdateItemCommand({
    TableName: "student-applications",
    Key: {
      Email: {S: studentEmail}
    },
    ExpressionAttributeNames: {
      "#universityDetails": "universityDetails",
      "#universityName": "universityName",
      "#universityState": "universityState",
      "#universityCity": "universityCity",
      "#universityZipCode": "universityZipCode",
      "#studentsMajor": "studentsMajor",
      "#studentStudyField": "studentStudyField",
      "#studentCareer": "studentCareer",
      "#universityAcceptance": "universityAcceptance",
      "#tuitionCost": "tuitionCost",
      "#roomBoard": "roomBoard",
    },
    ExpressionAttributeValues: {
      ":universityDetails": {S: universityInfo.universityDetails},
      ":universityName": {S: universityInfo.universityName},
      ":universityState": {S: universityInfo.universityState},
      ":universityCity": {S: universityInfo.universityCity},
      ":universityZipCode": {S: universityInfo.universityZipCode},
      ":studentsMajor": {S: universityInfo.studentsMajor},
      ":studentStudyField": {S: universityInfo.studentStudyField},
      ":studentCareer": {S: universityInfo.studentCareer},
      ":universityAcceptance": {SS: JSON.parse(universityInfo.universityAcceptance)},
      ":tuitionCost": {N: universityInfo.tuitionCost.toString()},
      ":roomBoard": {N: universityInfo.roomBoard.toString()},
    },
    UpdateExpression: "SET #universityDetails = :universityDetails," +
      "#universityName = :universityName," +
      "#universityState = :universityState," +
      "#universityCity = :universityCity," +
      "#universityZipCode = :universityZipCode," +
      "#studentsMajor = :studentsMajor," +
      "#studentStudyField = :studentStudyField," +
      "#studentCareer = :studentCareer," +
      "#universityAcceptance = :universityAcceptance," +
      "#tuitionCost = :tuitionCost," +
      "#roomBoard = :roomBoard"
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
