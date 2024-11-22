import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";


const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  try {
    const command = new ScanCommand({
      TableName: "test-table",
      Select: "ALL_ATTRIBUTES"
    });

    const dbresponse = await client.send(command);
    return buildResponse(dbresponse.$metadata.httpStatusCode, dbresponse);
  } catch (e) {
    console.error(e);
    return buildResponse(e.$metadata.httpStatusCode, e.message);
  }
};

const buildResponse = (statusCode, bodyContent) => {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      // "Access-Control-Allow-Origin": "https://alphafetus-testbucket.s3.amazonaws.com",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    },
    body: JSON.stringify(bodyContent)
  };
};
