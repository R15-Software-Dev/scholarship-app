import {DynamoDBClient, PutItemCommand, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse } from "../types/aws";
import { ScholarshipInfo } from "../types/scholarship";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the scholarship info table in DynamoDB
 * @param {ScholarshipInfo} event - A scholarship info object
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input: ScholarshipInfo = JSON.parse(event.body);

  // Get scholarship ID from the passed cookie header
  const scholarshipID = event.headers.Cookie.match(/scholarshipID=([^;]*)/)[1];
  // console.log(`Found scholarship ID: ${scholarshipID}`);

  // Create a command to update everything that may be entered in the "info" form.
  const command = new UpdateItemCommand({
    TableName: "scholarship-info",
    Key: {
      ScholarshipID: {S: scholarshipID}
    },
    ExpressionAttributeNames: {
      "#scholarshipTitle": "scholarshipTitle",
      "#scholarshipSponsor": "scholarshipSponsor",
      "#scholarshipNumAwards": "scholarshipNumAwards",
      "#scholarshipAwardsTotal": "scholarshipAwardsTotal",
      "#scholarshipAmountPerAward": "scholarshipAmountPerAward"
    },
    ExpressionAttributeValues: {
      ":scholarshipTitle": {S: input.scholarshipTitle},
      ":scholarshipSponsor": {S: input.scholarshipSponsor},
      ":scholarshipNumAwards": {N: input.scholarshipNumAwards.toString()},
      ":scholarshipAwardsTotal": {N: input.scholarshipAwardsTotal.toString()},
      ":scholarshipAmountPerAward": {N: input.scholarshipAmountPerAward.toString()},
    },
    UpdateExpression: "SET #scholarshipTitle = :scholarshipTitle, #scholarshipSponsor = :scholarshipSponsor," +
      "#scholarshipNumAwards = :scholarshipNumAwards, #scholarshipAwardsTotal = :scholarshipAwardsTotal," +
      "#scholarshipAmountPerAward = :scholarshipAmountPerAward"
  });

  try {
    // Send the command
    const dbresponse = await client.send(command);
  } catch (e) {
    // Return that there was an error
    console.error(e);
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    };
  }

  // Return that there was a success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
}
