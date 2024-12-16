import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse } from "../types/aws";
import { ScholarshipInfo } from "../types/scholarship";

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the scholarship info table in DynamoDB
 * @param {ScholarshipInfo} event - A scholarship info object
 * @returns DynamoDB response object
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input = JSON.parse(event.body);
  const info: ScholarshipInfo = input.info;

  // TODO Convert this into the proper UpdateItemCommand.
  const command = new PutItemCommand({
    TableName: "scholarship-info",
    Item: {
      sclshpTitle: { S: input.sclshpTitle },
      sclshpSponsor: { S: input.sclshpSponsor },
      sclshpNumAwards: { N: input.sclshpNumAwards },
      sclshpAwardsTotal: { N: input.sclshpAwardsTotal },
      sclshpAmountPerAward: { N: input.sclshpAmountPerAward },
    },
  });

  // TODO Properly catch any errors from the client
  try {
    const dbresponse = await client.send(command);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
}
