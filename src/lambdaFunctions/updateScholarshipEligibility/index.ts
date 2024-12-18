import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import {AWSRequest, AWSResponse, ScholarshipEligibility } from "./../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the scholarship info table in DynamoDB
 * @param event - A scholarship eligibility object
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const info: ScholarshipEligibility = JSON.parse(event.body);

  // Get the scholarship ID from the passed cookie
  const scholarshipID = event.headers.Cookie.match(/scholarshipID=([^;]*)/)[1];
  console.log(`Found scholarship ID: ${scholarshipID}`);
  const command = new UpdateItemCommand({
    TableName: "scholarship-info",
    Key: {
      ScholarshipID: {S: scholarshipID}
    },
    ExpressionAttributeNames: {
      "#studentResidence": "studentResidence",
      "#scholarshipNonPHS": "scholarshipNonPHS",
      "#studyRequirement": "studyRequirement",
      "#financialRequirement": "financialRequirement",
      "#eligibilityOther": "eligibilityOther"
    },
    ExpressionAttributeValues: {
      ":studentResidence": {S: info.studentResidence},
      ":scholarshipNonPHS": {BOOL: info.scholarshipNonPHS},
      ":studyRequirement": {BOOL: info.studyRequirement},
      ":financialRequirement": {BOOL: info.financialRequirement},
      ":eligibilityOther": {S: info.eligibilityOther}
    },
    UpdateExpression: "SET #studentResidence = :studentResidence, #scholarshipNonPHS = :scholarshipNonPHS," +
      "#studyRequirement = :studyRequirement, #financialRequirement = :financialRequirement," +
      "#eligibilityOther = :eligibilityOther"
  });

  // TODO Properly catch any errors from the client
  try {
    const dbresponse = await client.send(command);
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" })
  };
}
