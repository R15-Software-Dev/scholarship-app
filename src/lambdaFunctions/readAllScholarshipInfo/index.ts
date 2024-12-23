import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import {AWSRequest, AWSResponse, Scholarship} from "../types/types";

// Create a dynamo client
const client = new DynamoDBClient({ region: "us-east-1" });

export async function handler(event: AWSRequest): Promise<AWSResponse> {
  // Get all the information about a scholarship and parse it into
  // a reasonable form.
  
  // First match the scholarship ID from the event's cookies
  const scholarshipID = event.headers.Cookie.match(/scholarshipID=([^;]*)/)[1];

  // Create a command to get all the scholarship's information
  const command = new GetItemCommand({
    TableName: "scholarship-info",
    Key: {
      Name: { S: scholarshipID }
    },
    AttributesToGet: [
      "homePhone",
      "businessPhone",
      "cellPhone",
      "contactEmail",
      "sponsorAddress",
      "sponsorCity",
      "sponsorZipCode",
      "sponsorState",
      "additionalInfo",
      "studentResidence",
      "scholarshipNonPHS",
      "studyRequirement",
      "financialRequirement",
      "eligibilityOther",
      "scholarshipTitle",
      "scholarshipSponsor",
      "scholarshipNumAwards",
      "scholarshipAwardsTotal",
      "scholarshipAmountPerAward",
      "studentAidReport",
      "studentInterviews",
      "recipientSelection",
      "transcriptRequirements",
      "awardTo",
      "scholarshipReApplication",
      "essayRequirement",
      "essaySelection",
      "awardNightRemarks"
    ]
  });

  // Send the command and wait for an Item.
  // If there's no item, this will throw an error.
  const dbresponse = await client.send(command);
  const dbitem = dbresponse.Item;
  
  // Construct the response
  const response: Scholarship = {
    contactName: dbitem.contactName.S,
    homePhone: dbitem.homePhone.S, 
    businessPhone: dbitem.businessPhone.S, 
    cellPhone: dbitem.cellPhone.S, 
    contactEmail: dbitem.contactEmail.S, 
    sponsorAddress: dbitem.sponsorAddress.S,
    sponsorCity: dbitem.sponsorCity.S, 
    sponsorZipCode: dbitem.sponsorZipCode.S, 
    sponsorState: dbitem.sponsorState.S,
    additionalInfo: dbitem.additionalInfo.S,
    studentResidence: dbitem.studentResidence.S, 
    scholarshipNonPHS: dbitem.scholarshipNonPHS.BOOL, 
    studyRequirement: dbitem.studyRequirement.BOOL, 
    financialRequirement: dbitem.financialRequirement.BOOL, 
    eligibilityOther: dbitem.eligibilityOther.S,
    scholarshipTitle: dbitem.scholarshipTitle.S, 
    scholarshipSponsor: dbitem.scholarshipSponsor.S, 
    scholarshipNumAwards: Number(dbitem.scholarshipNumAwards.N), 
    scholarshipAwardsTotal: Number(dbitem.scholarshipAwardsTotal.N), 
    scholarshipAmountPerAward: Number(dbitem.scholarshipAmountPerAward.N),
    studentAidReport: dbitem.studentAidReport.BOOL,
    studentInterviews: dbitem.studentInterviews.BOOL,
    recipientSelection: dbitem.recipientSelection.S,
    transcriptRequirements: dbitem.transcriptRequirements.BOOL,
    awardTo: dbitem.awardTo.BOOL,
    scholarshipReApplication: dbitem.scholarshipReApplication.BOOL,
    essayRequirement: dbitem.essayRequirement.BOOL,
    essaySelection: dbitem.essaySelection.SS,
    awardNightRemarks: dbitem.awardNightRemarks.S
  }
  
  // Return the information
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}