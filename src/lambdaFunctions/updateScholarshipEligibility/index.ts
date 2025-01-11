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
  console.log(info);

  // Get the scholarship ID from the passed cookie
  const scholarshipID = event.headers.Cookie.match(/scholarshipID=([^;]*)/)[1];
  // console.log(`Found scholarship ID: ${scholarshipID}`);

  // Create a command to update everything that may be entered in the eligibility form.
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
      "#eligibilityOther": "eligibilityOther",
      "#requiredResidenceArea": "requiredResidenceArea",
      "#requiredStudyArea": "requiredStudyArea"
    },
    ExpressionAttributeValues: {
      ":studentResidence": {SS: JSON.parse(info.studentResidence)},
      ":scholarshipNonPHS": {SS: JSON.parse(info.scholarshipNonPHS)},
      ":studyRequirement": {SS: JSON.parse(info.studyRequirement)},
      ":financialRequirement": {SS: JSON.parse(info.financialRequirement)},
      ":eligibilityOther": {S: info.eligibilityOther},
      ":requiredResidenceArea": {S: info.requiredResidenceArea},
      ":requiredStudyArea": {S: info.requiredStudyArea}
    },
    UpdateExpression: "SET #studentResidence = :studentResidence," +
      "#requiredResidenceArea = :requiredResidenceArea," +
      "#scholarshipNonPHS = :scholarshipNonPHS," +
      "#studyRequirement = :studyRequirement," +
      "#requiredStudyArea = :requiredStudyArea," +
      "#financialRequirement = :financialRequirement," +
      "#eligibilityOther = :eligibilityOther"
  });

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
    body: JSON.stringify({ message: "Success" })
  };
}
