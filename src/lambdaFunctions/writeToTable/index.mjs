import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({ region: "us-east-1" });

// Designed for use with a POST request.
export const handler = async (event) => {
  console.log("Attempting to run function...");
  try {
    // const input = JSON.parse(event);
    console.log("Running function.");

    // if (!event.body.email) throw new Error("Primary key was not included in POST.");
    // if (!event.email) {
    //   console.log("There was an error.");
    //   throw new Error("Primary key not found.");
    // }

    const command = new PutItemCommand({
      TableName: "test-table",
      Item: {
        emailAddress: { S: input.email },
        firstName: { S: input.firstName ? input.firstName : "" },
        lastName: { S: input.lastName ? input.lastName : "" },
      }
    });

    // return buildResponse(dbresponse.$metadata.httpStatusCode, dbresponse);
    const dbresponse = await client.send(command);
    return dbresponse;  // Return the database response json
  } catch (e) {
    console.error(e.message);
    throw new Error(e.message);
  }
}

// const buildResponse = (statusCode, bodyContent) => {
//   return {
//     statusCode: statusCode,
//     headers: {
//       "Access-Control-Allow-Headers" : "Content-Type",
//       "Access-Control-Allow-Origin": "https://alphafetus-testbucket.s3.amazonaws.com",
//       "Access-Control-Allow-Methods": "OPTIONS,POST"
//     },
//     body: JSON.stringify(bodyContent)
//   };
// };
