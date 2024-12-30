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
      ScholarshipID: { S: scholarshipID }
    },
    AttributesToGet: [
      "homePhone",
      "businessPhone",
      "cellPhone",
      "contactName",
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
    contactName: dbitem?.contactName?.S ?? null,
    homePhone: dbitem?.homePhone?.S ?? null,
    businessPhone: dbitem?.businessPhone?.S ?? null,
    cellPhone: dbitem?.cellPhone?.S ?? null,
    contactEmail: dbitem?.contactEmail?.S ?? null,
    sponsorAddress: dbitem?.sponsorAddress?.S ?? null,
    sponsorCity: dbitem?.sponsorCity?.S ?? null,
    sponsorZipCode: dbitem?.sponsorZipCode?.S ?? null,
    sponsorState: dbitem?.sponsorState?.S ?? null,
    additionalInfo: dbitem?.additionalInfo?.S ?? null,
    studentResidence: dbitem?.studentResidence?.S ?? null,
    scholarshipNonPHS: dbitem?.scholarshipNonPHS?.BOOL,
    studyRequirement: dbitem?.studyRequirement?.BOOL,
    financialRequirement: dbitem?.financialRequirement?.BOOL,
    eligibilityOther: dbitem?.eligibilityOther?.S ?? null,
    scholarshipTitle: dbitem?.scholarshipTitle?.S ?? null,
    scholarshipSponsor: dbitem?.scholarshipSponsor?.S ?? null,
    scholarshipNumAwards: Number(dbitem?.scholarshipNumAwards?.N ?? null),
    scholarshipAwardsTotal: Number(dbitem?.scholarshipAwardsTotal?.N ?? null),
    scholarshipAmountPerAward: Number(dbitem?.scholarshipAmountPerAward?.N ?? null),
    studentAidReport: dbitem?.studentAidReport?.BOOL ?? null,
    studentInterviews: dbitem?.studentInterviews?.BOOL ?? null,
    recipientSelection: dbitem?.recipientSelection?.S ?? null,
    transcriptRequirements: dbitem?.transcriptRequirements?.BOOL ?? null,
    awardTo: dbitem?.awardTo?.BOOL ?? null,
    scholarshipReApplication: dbitem?.scholarshipReApplication?.BOOL ?? null,
    essayRequirement: dbitem?.essayRequirement?.BOOL ?? null,
    essaySelection: dbitem?.essaySelection?.SS ?? null,
    awardNightRemarks: dbitem?.awardNightRemarks?.S ?? null
  }
  
  // Return the information
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}