import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse, ScholarshipEligibility } from "./../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the scholarship info table in DynamoDB
 * @param {ScholarshipEligibility} event - A scholarship eligibility object
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input = JSON.parse(event.body);
  const info: ScholarshipEligibility = input.scholarshipInfo;

  const command = new PutItemCommand({
    TableName: "scholarship-info",
    Item: {
      studentResidence: { S: info.studentResidence },
      scholarshipNonPHS: { BOOL: info.scholarshipNonPHS },
      studyRequirement: { BOOL: info.studyRequirement },
      financialRequirement: { BOOL: info.financialRequirement },
      eligibilityOther: { S: info.eligibilityOther },
    },
  });

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
