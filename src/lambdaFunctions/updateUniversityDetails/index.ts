import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse} from "./../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the ___ table in DynamoDb
 * @param event -
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {

  const /*university*/info /*studentUniversityInfo*/ = JSON.parse(event.body);

  // Create variable for the student table IDs corresponding cookie

  // Create a command to update everything that may be entered in the university details form
  const command = new UpdateItemCommand({
    TableName: "",
    Key: {
      //Key
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
      "#travelCosts": "travelCosts",
      "#miscCosts": "miscCosts"
    },
    ExpressionAttributeValues: {
      ":universityDetails": {S: info.universityDetails},
      ":universityName": {S: info.universityName},
      ":universityState": {S: info.universityState},
      ":universityCity": {S: info.universityCity},
      ":universityZipCode": {S: info.universityZipCode},
      ":studentsMajor": {S: info.studentsMajor},
      ":studentStudyField": {S: info.studentStudyField},
      ":studentCareer": {S: info.studentCareer},
      ":universityAcceptance": {SS: JSON.parse(info.universityAcceptance)},
      ":tuitionCost": {N: info.tuitionCost.toString()},
      ":roomBoard": {N: info.roomBoard.toString()},
      ":travelCosts": {N: info.travelCosts.toString()},
      ":miscCosts": {N: info.miscCosts.toString()}
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
      "#roomBoard = :roomBoard," +
      "#travelCosts = :travelCosts," +
      "#miscCosts = :miscCosts"
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
