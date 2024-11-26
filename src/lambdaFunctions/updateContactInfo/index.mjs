import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({ region: "us-east-1" });

// Designed for use with a POST request.
export const handler = async (event) => {
    console.log("Attempting to run function...");
    try {

        console.log("Running function.");

        const command = new PutItemCommand({
            TableName: "contact-info",
            Item: {
                studentResidence: {BOOL: input.studentResidence},
                sclshpNonPHS: {BOOL: input.sclshpNonPHS},
                studyAreaRequirement: {S: input.studyAreaRequirement},
                financialNeed: {BOOL: input.financialNeed},
                eligibilityOther: {S: input.eligibilityOther}
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