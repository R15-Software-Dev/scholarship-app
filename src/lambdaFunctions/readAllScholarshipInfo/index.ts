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
      "requiredResidenceArea",
      "requiredStudyArea",
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
      "customEssayPrompt",
      "awardNightRemarks"
    ]
  });

  // Send the command and wait for an Item.
  // If there's no item, this will throw an error.
  const dbresponse = await client.send(command);
  const dbitem = dbresponse.Item;

  console.log(dbitem);

  // Construct the response
  // TODO Find a better way of getting SS values
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
    //@ts-ignore
    studentResidence: dbitem?.studentResidence?.SS ?? null,
    requiredResidenceArea: dbitem?.requiredResidenceArea?.S ?? null,
    //@ts-ignore
    scholarshipNonPHS: dbitem?.scholarshipNonPHS?.SS ?? null,
    //@ts-ignore
    studyRequirement: dbitem?.studyRequirement?.SS ?? null,
    requiredStudyArea: dbitem?.requiredStudyArea?.S ?? null,
    //@ts-ignore
    financialRequirement: dbitem?.financialRequirement?.SS ?? null,
    eligibilityOther: dbitem?.eligibilityOther?.S ?? null,
    scholarshipTitle: dbitem?.scholarshipTitle?.S ?? null,
    scholarshipSponsor: dbitem?.scholarshipSponsor?.S ?? null,
    scholarshipNumAwards: Number(dbitem?.scholarshipNumAwards?.N ?? null),
    scholarshipAwardsTotal: Number(dbitem?.scholarshipAwardsTotal?.N ?? null),
    scholarshipAmountPerAward: Number(dbitem?.scholarshipAmountPerAward?.N ?? null),
    //@ts-ignore
    studentAidReport: dbitem?.studentAidReport?.SS ?? null,
    //@ts-ignore
    studentInterviews: dbitem?.studentInterviews?.SS ?? null,
    recipientSelection: dbitem?.recipientSelection?.S ?? null,
    //@ts-ignore
    transcriptRequirements: dbitem?.transcriptRequirements?.SS ?? null,
    //@ts-ignore
    awardTo: dbitem?.awardTo?.SS ?? null,
    //@ts-ignore
    scholarshipReApplication: dbitem?.scholarshipReApplication?.SS ?? null,
    //@ts-ignore
    essayRequirement: dbitem?.essayRequirement?.SS ?? null,
    //@ts-ignore
    essaySelection: dbitem?.essaySelection?.SS ?? null,
    customEssayPrompt: dbitem?.customEssayPrompt?.S ?? null,
    awardNightRemarks: dbitem?.awardNightRemarks?.S ?? null
  }

  // Return the information
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}
