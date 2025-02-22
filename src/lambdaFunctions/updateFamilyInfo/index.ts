import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse} from "./../types/types";

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
      ":numChildTotal": {S: info.numChildTotal},
      ":numChildAttendCollege": {S: info.numChildAttendCollege},
      ":guardianOneName": {S: info.guardianOneName},
      ":guardianOneRelation": {S: info.guardianOneRelation},
      ":guardianOneOccupation": {S: info.guardianOneOccupation},
      ":guardianOneEmployer": {S: info.guardianOneEmployer},
      ":guardianTwoName": {S: info.guardianTwoName},
      ":guardianTwoRelation": {S: info.guardianTwoRelation},
      ":guardianTwoOccupation": {S: info.guardianTwoOccupation},
      ":guardianTwoEmployer": {S: info.guardianTwoEmployer},
      ":familyPEAMember": {SS: JSON.parse(info.familyPEAMember)},
      ":armedServiceMember": {SS: JSON.parse(info.armedServiceMember)},
      ":familyChurchMember": {SS: JSON.parse(info.familyChurchMember)}
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
