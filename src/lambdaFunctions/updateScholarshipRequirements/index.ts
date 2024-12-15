import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse, ScholarshipRequirements } from "../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the scholarship info table in DynamoDB
 * @param {ScholarshipRequirements} event - A scholarship requirements object
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input = JSON.parse(event.body);
  const info: ScholarshipRequirements = input.info;

  const command = new PutItemCommand({
    TableName: "scholarship-info",
    Item: {
      studentAidReport: { BOOL: input.studentAidReport },
      studentInterviews: { BOOL: input.studentInterviews },
      recipientSelection: { S: input.recipientSelection },
      transcriptRequirements: { BOOL: input.transcriptRequirements },
      awardTo: { BOOL: input.awardTo },
      sclshpReApplication: { BOOL: input.sclshpReApplication },
      essayRequirement: { BOOL: input.essayRequirement },
      essaySelection: { SS: input.essaySelection },
      awardNightRemarks: { S: input.awardNightRemarks },
    },
  });

  try {
    const dbresponse = await client.send(command);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating scholarship info" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Scholarship info updated successfully" }),
  };
}
