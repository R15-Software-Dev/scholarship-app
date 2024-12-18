import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse, ScholarshipRequirements } from "../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the scholarship info table in DynamoDB
 * @param {ScholarshipRequirements} event - A scholarship requirements object
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const info: ScholarshipRequirements = JSON.parse(event.body);
  
  // Get the scholarship ID from the passed cookie
  const scholarshipID = event.headers.Cookie.match(/scholarshipID=([^;]*)/)[1];
  console.log(`Found scholarship ID: ${scholarshipID}`);
  const command = new UpdateItemCommand({
    TableName: "scholarship-info",
    Key: {
      ScholarshipID: {S: scholarshipID}
    },
    UpdateExpression: "SET #studentAidReport = :studentAidReport, #studentInterviews = :studentInterviews," +
      "#recipientSelection = :recipientSelection, #transcriptRequirements = :transcriptRequirements," +
      "#awardTo = :awardTo, #sclshpReApplication = :sclshpReApplication, #essayRequirement = :essayRequirement," +
      "#essaySelection = :essaySelection, #awardNightRemarks = :awardNightRemarks",
    ExpressionAttributeValues: {
      ":studentAidReport": {BOOL: info.studentAidReport},
      ":studentInterviews": {BOOL: info.studentInterviews},
      ":recipientSelection": {S: info.recipientSelection},
      ":transcriptRequirements": {BOOL: info.transcriptRequirements},
      ":awardTo": {BOOL: info.awardTo},
      ":sclshpReApplication": {BOOL: info.sclshpReApplication},
      ":essayRequirement": {BOOL: info.essayRequirement},
      ":essaySelection": {SS: info.essaySelection},
      ":awardNightRemarks": {S: info.awardNightRemarks}
    },
    ExpressionAttributeNames: {
      "#studentAidReport": "studentAidReport",
      "#studentInterviews": "studentInterviews",
      "#recipientSelection": "recipientSelection",
      "#transcriptRequirements": "transcriptRequirements",
      "#awardTo": "awardTo",
      "#sclshpReApplication": "sclshpReApplication",
      "#essayRequirement": "essayRequirement",
      "#essaySelection": "essaySelection",
      "#awardNightRemarks": "awardNightRemarks"
    }
  });

  try {
    const dbresponse = await client.send(command);
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
}
