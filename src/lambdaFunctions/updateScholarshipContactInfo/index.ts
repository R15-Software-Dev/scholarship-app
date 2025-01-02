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
  console.log(scholarshipInfo);

  // Get the scholarship ID from the corresponding cookie
  const scholarshipID = event.headers.Cookie.match(/scholarshipID=([^;]*)/)[1];
  // console.log(`Found scholarship ID: ${scholarshipID}`);

  // Create a command to update everything that may be entered in the contact info form.
  const command = new UpdateItemCommand({
    TableName: "scholarship-info",
    Key: {
      ScholarshipID: {S: scholarshipID.toString()}
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
      ":sponsorZipCode": {S: scholarshipInfo.sponsorZipCode},
      ":sponsorState": {S: scholarshipInfo.sponsorState}
    },
    UpdateExpression: "SET #contactName = :contactName, #homePhone = :homePhone, #businessPhone = :businessPhone," +
      "#cellPhone = :cellPhone, #contactEmail = :contactEmail, #sponsorAddress = :sponsorAddress," +
      "#sponsorCity = :sponsorCity, #sponsorZipCode = :sponsorZipCode, #sponsorState = :sponsorState"
  });

  // console.log("Sending update command...");
  try {
    // Send the command
    const dbresponse = await client.send(command);
    // console.log("Update command sent successfully.");
  } catch (e) {
    // console.error(e.message);
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
