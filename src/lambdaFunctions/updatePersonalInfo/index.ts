import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import {AWSRequest, AWSResponse, StudentPersonalInfo} from "./../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the student applications table in DynamoDB
 * @param event - A personal info object
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {

  const studentInfo: StudentPersonalInfo = JSON.parse(event.body);

  // Create variable for the student table IDs corresponding cookie

  // Create a command to update everything that may be entered in the personal info form
  const command = new UpdateItemCommand({
    TableName: "student-applications",
    Key: {
      //Key
    },
    ExpressionAttributeNames: {
      "#studentFirstName": "studentFirstName",
      "#studentLastName": "studentLastName",
      "#studentIDNumber": "studentIDNumber",
      "#studentBirthDate": "studentBirthDate",
      "#studentGender": "studentGender",
      "#streetAddress": "streetAddress",
      "#studentTown": "studentTown",
      "#studentPhoneNumber": "studentPhoneNumber",
      "#studentEmail": "studentEmail",
      "#unweightedGPA": "unweightedGPA",
      "#readingScoreSAT": "readingScoreSAT",
      "#mathScoreSAT": "mathScoreSAT",
      "#highScoreACT": "highScoreACT",
      "#attendBAS": "attendBAS"
    },
    ExpressionAttributeValues: {
      ":studentFirstName": {S: studentInfo.studentFirstName},
      ":studentLastName": {S: studentInfo.studentLastName},
      ":studentIDNumber": {N: studentInfo.studentIDNumber.toString()},
      ":studentBirthDate": {S: studentInfo.studentBirthDate},
      ":studentGender": {SS: JSON.parse(studentInfo.studentGender)},
      ":streetAddress": {S: studentInfo.streetAddress},
      ":studentTown": {SS: JSON.parse(studentInfo.studentTown)},
      ":studentPhoneNumber": {S: studentInfo.studentPhoneNumber},
      ":studentEmail": {S: studentInfo.studentEmail},
      ":unweightedGPA": {S: studentInfo.unweightedGPA},
      ":readingScoreSAT": {N: studentInfo.readingScoreSAT.toString()},
      ":mathScoreSAT": {N: studentInfo.mathScoreSAT.toString()},
      ":highScoreACT": {N: studentInfo.highScoreACT.toString()},
      ":attendBAS": {SS: JSON.parse(studentInfo.attendBAS)}
    },
    UpdateExpression: "SET #studentFirstName = :studentFirstName," +
      "#studentLastName = :studentLastName," +
      "#studentIDNumber = :studentIDNumber," +
      "#studentBirthDate = :studentBirthDate," +
      "#studentGender = :studentGender," +
      "#streetAddress = :streetAddress," +
      "#studentTown = :studentTown," +
      "#studentPhoneNumber = :studentPhoneNumber," +
      "#studentEmail = :studentEmail," +
      "#unweightedGPA = :unweightedGPA," +
      "#readingScoreSAT = :readingScoreSAT," +
      "#mathScoreSAT = :mathScoreSAT," +
      "#highScoreACT = :highScoreACT," +
      "#attendBAS = :attendBAS"
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
