import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse, ScholarshipContactInfo } from "./../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the contact info table in DynamoDB
 * @param {ContactInfo} event - Scholarship provider contact info object
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input = JSON.parse(event.body);
  const scholarshipInfo: ScholarshipContactInfo = input.scholarshipInfo;

  // TODO Convert this into the proper UpdateItemCommand.
  const command = new PutItemCommand({
    TableName: "scholarship-info",
    Item: {
      contactName: { S: scholarshipInfo.contactName },
      homePhone: { S: scholarshipInfo.homePhone },
      businessPhone: { S: scholarshipInfo.businessPhone },
      cellPhone: { S: scholarshipInfo.cellPhone },
      contactEmail: { S: scholarshipInfo.contactEmail },
      sponsorAddress: { S: scholarshipInfo.sponsorAddress },
      sponsorCity: { S: scholarshipInfo.sponsorCity },
      sponsorZipCode: { S: scholarshipInfo.sponsorZipCode },
      sponsorState: { S: scholarshipInfo.sponsorState },
      additionalInfo: { S: scholarshipInfo.additionalInfo },
    },
    // ConditionExpression: "attribute_not_exists(contactName)",
  });

  // TODO Properly catch any errors from the client
  try {
    const dbresponse = await client.send(command);
  } catch (e) {
    console.error(e.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: e.message }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
}
