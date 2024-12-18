import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse, ScholarshipContactInfo } from "./../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the contact info table in DynamoDB
 * @param event - Scholarship provider contact info object
 * @returns AWSResponse that contains a success or error code.
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const scholarshipInfo: ScholarshipContactInfo = JSON.parse(event.body);

  // Get the scholarship ID from the corresponding cookie
  const scholarshipID = event.headers.cookie.match(/scholarshipID=(\w+)/)[1];
  console.log(`Found scholarship ID: ${scholarshipID}`);
  const command = new UpdateItemCommand({
    TableName: "scholarship-info",
    Key: {
      ScholarshipID: {S: scholarshipID}
    },
    ExpressionAttributeNames: {
      "#contactName": "contactName",
      "#homePhone": "homePhone",
      "#businessPhone": "businessPhone",
      "#cellPhone": "cellPhone",
      "#contactEmail": "contactEmail",
      "#sponsorAddress": "sponsorAddress",
      "#sponsorCity": "sponsorCity",
      "#sponsorZipCode": "sponsorZipCode",
      "#sponsorState": "sponsorState"
    },
    ExpressionAttributeValues: {
      ":contactName": {S: scholarshipInfo.contactName},
      ":homePhone": {S: scholarshipInfo.homePhone},
      ":businessPhone": {S: scholarshipInfo.businessPhone},
      ":cellPhone": {S: scholarshipInfo.cellPhone},
      ":contactEmail": {S: scholarshipInfo.contactEmail},
      ":sponsorAddress": {S: scholarshipInfo.sponsorAddress},
      ":sponsorCity": {S: scholarshipInfo.sponsorCity},
      ":sponsorZipCode": {S: scholarshipInfo.sponsorZipCode}
    },
    UpdateExpression: "SET #contactName = :contactName, #homePhone = :homePhone, #businessPhone = :businessPhone," +
      "#cellPhone = :cellPhone, #contactEmail = :contactEmail, #sponsorAddress = :sponsorAddress," +
      "#sponsorCity = :sponsorCity, #sponsorZipCode = :sponsorZipCode"
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
