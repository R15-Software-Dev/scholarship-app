import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import {AWSRequest, AWSResponse, FamilyInfo} from "./../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the student applications table in DynamoDB
 * @param {FamilyInfo}event - A family info object
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {

  const familyInfo: FamilyInfo = JSON.parse(event.body);

  // Create variable for the student table IDs corresponding cookie

  // Create a command to update everything that may be entered in the family info form
  const command = new UpdateItemCommand({
    TableName: "student-applications",
    Key: {
      //Key
    },
    ExpressionAttributeNames: {
      "#numChildTotal": "numChildTotal",
      "#numChildAttendCollege": "numChildAttendCollege",
      "#guardianOneName": "guardianOneName",
      "#guardianOneRelation": "guardianOneRelation",
      "#guardianOneOccupation": "guardianOneOccupation",
      "#guardianOneEmployer": "guardianOneEmployer",
      "#guardianTwoName": "guardianTwoName",
      "#guardianTwoRelation": "guardianTwoRelation",
      "#guardianTwoOccupation": "guardianTwoOccupation",
      "#guardianTwoEmployer": "guardianTwoEmployer",
      "#familyPEAMember": "familyPEAMember",
      "#armedServiceMember": "armedServiceMember",
      "#familyChurchMember": "familyChurchMember"
    },
    ExpressionAttributeValues: {
      ":numChildTotal": {S: familyInfo.numChildTotal},
      ":numChildAttendCollege": {S: familyInfo.numChildAttendCollege},
      ":guardianOneName": {S: familyInfo.guardianOneName},
      ":guardianOneRelation": {S: familyInfo.guardianOneRelation},
      ":guardianOneOccupation": {S: familyInfo.guardianOneOccupation},
      ":guardianOneEmployer": {S: familyInfo.guardianOneEmployer},
      ":guardianTwoName": {S: familyInfo.guardianTwoName},
      ":guardianTwoRelation": {S: familyInfo.guardianTwoRelation},
      ":guardianTwoOccupation": {S: familyInfo.guardianTwoOccupation},
      ":guardianTwoEmployer": {S: familyInfo.guardianTwoEmployer},
      ":familyPEAMember": {SS: JSON.parse(familyInfo.familyPEAMember)},
      ":armedServiceMember": {SS: JSON.parse(familyInfo.armedServiceMember)},
      ":familyChurchMember": {SS: JSON.parse(familyInfo.familyChurchMember)}
    },
    UpdateExpression: "SET #numChildTotal = :numChildTotal," +
      "#numChildAttendCollege = :numChildAttendCollege," +
      "#guardianOneName = :guardianOneName," +
      "#guardianOneRelation = :guardianOneRelation," +
      "#guardianOneOccupation = :guardianOneOccupation," +
      "#guardianOneEmployer = :guardianOneEmployer," +
      "#guardianTwoName = :guardianTwoName," +
      "#guardianTwoRelation = :guardianTwoRelation," +
      "#guardianTwoOccupation = :guardianTwoOccupation," +
      "#guardianTwoEmployer = :guardianTwoEmployer," +
      "#familyPEAMember = :familyPEAMember," +
      "#armedServiceMember = :armedServiceMember," +
      "#familyChurchMember = :familyChurchMember"
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
