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

  console.log(info);

  // Get the scholarship ID from the passed cookie
  const scholarshipID = event.headers.Cookie.match(/scholarshipID=([^;]*)/)[1];
  // console.log(`Found scholarship ID: ${scholarshipID}`);

  // Create a command to update everything that may be entered in the requirements form.
  let command: UpdateItemCommand;
  if (info.essayRequirement === '["Yes"]') {
    const essaySelection = (info.essaySelection === '[]') ? '["None"]' : info.essaySelection;
    command = new UpdateItemCommand({
      TableName: "scholarship-info",
      Key: {
        ScholarshipID: {S: scholarshipID}
      },
      UpdateExpression: "SET #studentAidReport = :studentAidReport," +
        "#studentInterviews = :studentInterviews," +
        "#recipientSelection = :recipientSelection," +
        "#transcriptRequirements = :transcriptRequirements," +
        "#awardTo = :awardTo, " +
        // "#sclshpReApplication = :sclshpReApplication," +
        "#essayRequirement = :essayRequirement," +
        "#essaySelection = :essaySelection," +
        "#awardNightRemarks = :awardNightRemarks," +
        "#customEssayPrompt = :customEssayPrompt",
      ExpressionAttributeValues: {
        ":studentAidReport": {SS: JSON.parse(info.studentAidReport)},
        ":studentInterviews": {SS: JSON.parse(info.studentInterviews)},
        ":recipientSelection": {S: info.recipientSelection},
        ":transcriptRequirements": {SS: JSON.parse(info.transcriptRequirements)},
        ":awardTo": {SS: JSON.parse(info.awardTo)},
        // ":sclshpReApplication": {SS: JSON.parse(info.scholarshipReApplication)},
        ":essayRequirement": {SS: JSON.parse(info.essayRequirement)},
        ":essaySelection": {SS: JSON.parse(essaySelection)},
        ":awardNightRemarks": {S: info.awardNightRemarks},
        ":customEssayPrompt": {S: info.customEssayPrompt}
      },
      ExpressionAttributeNames: {
        "#studentAidReport": "studentAidReport",
        "#studentInterviews": "studentInterviews",
        "#recipientSelection": "recipientSelection",
        "#transcriptRequirements": "transcriptRequirements",
        "#awardTo": "awardTo",
        // "#sclshpReApplication": "scholarshipReApplication",
        "#essayRequirement": "essayRequirement",
        "#essaySelection": "essaySelection",
        "#awardNightRemarks": "awardNightRemarks",
        "#customEssayPrompt": "customEssayPrompt"
      }
    });
  } else {
    // Create a command to update everything that may be entered in the requirements form, except for the essay prompt
    // and essay selection
    console.log("Entering values without essay requirement");
    command = new UpdateItemCommand({
      TableName: "scholarship-info",
      Key: {
        ScholarshipID: { S: scholarshipID }
      },
      UpdateExpression: "SET #studentAidReport = :studentAidReport," +
        "#studentInterviews = :studentInterviews," +
        "#recipientSelection = :recipientSelection," +
        "#transcriptRequirements = :transcriptRequirements," +
        "#awardTo = :awardTo, " +
        // "#sclshpReApplication = :sclshpReApplication," +
        "#essayRequirement = :essayRequirement," +
        "#awardNightRemarks = :awardNightRemarks",
      ExpressionAttributeValues: {
        ":studentAidReport": { SS: JSON.parse(info.studentAidReport) },
        ":studentInterviews": { SS: JSON.parse(info.studentInterviews) },
        ":recipientSelection": { S: info.recipientSelection },
        ":transcriptRequirements": { SS: JSON.parse(info.transcriptRequirements) },
        ":awardTo": { SS: JSON.parse(info.awardTo) },
        // ":sclshpReApplication": {SS: JSON.parse(info.scholarshipReApplication)},
        ":essayRequirement": { SS: JSON.parse(info.essayRequirement) },
        ":awardNightRemarks": { S: info.awardNightRemarks }
      },
      ExpressionAttributeNames: {
        "#studentAidReport": "studentAidReport",
        "#studentInterviews": "studentInterviews",
        "#recipientSelection": "recipientSelection",
        "#transcriptRequirements": "transcriptRequirements",
        "#awardTo": "awardTo",
        // "#sclshpReApplication": "scholarshipReApplication",
        "#essayRequirement": "essayRequirement",
        "#awardNightRemarks": "awardNightRemarks"
      }
    });
  }

  try {
    // Send the command
    const dbresponse = await client.send(command);
  } catch (e) {
    // Return that there was an error
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }

  // Return that there was a success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
}
