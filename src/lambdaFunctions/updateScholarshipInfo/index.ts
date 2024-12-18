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
  const scholarshipID = event.headers.cookie.match(/scholarshipID=(\w+)/)[1];
  console.log(`Found scholarship ID: ${scholarshipID}`);
  const command = new UpdateItemCommand({
    TableName: "scholarship-info",
    Key: {
      ScholarshipID: {S: scholarshipID}
    },
    ExpressionAttributeNames: {
      "#sclshpTitle": "sclshpTitle",
      "#sclshpSponsor": "sclshpSponsor",
      "#sclshpNumAwards": "sclshpNumAwards",
      "#sclshpAwardsTotal": "sclshpAwardsTotal",
      "#sclshpAmountPerAward": "sclshpAmountPerAward"
    },
    ExpressionAttributeValues: {
      ":sclshpTitle": {S: input.scholarshipTitle},
      ":sclshpSponsor": {S: input.scholarshipSponsor},
      ":sclshpNumAwards": {N: input.scholarshipNumAwards.toString()},
      ":sclshpAwardsTotal": {N: input.scholarshipAwardsTotal.toString()},
      ":sclshpAmountPerAward": {N: input.scholarshipAmountPerAward.toString()},
    },
    UpdateExpression: "SET #sclshpTitle = :sclshpTitle, #sclshpSponsor = :sclshpSponsor," +
      "#sclshpNumAwards = :sclshpNumAwards, #sclshpAwardsTotal = :sclshpAwardsTotal"
  });

  // TODO Properly catch any errors from the client
  try {
    const dbresponse = await client.send(command);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
}
