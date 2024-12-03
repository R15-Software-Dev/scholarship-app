import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the contact info table in DynamoDB
 * @param {ContactInfo} event - Scholarship provider contact info object
 * @returns DynamoDB response object
 */
export async function handler(event) {
    console.log("Attempting to run function...");
    try {

        const input = JSON.parse(event.body);

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

class ContactInfo {
    constructor (
        studentResidence,
        sclshpNonPHS,
        studyAreaRequirement,
        financialNeed,
        eligibilityOther
        ) {
        return {
            studentResidence: studentResidence,
            sclshpNonPHS: sclshpNonPHS,
            studyAreaRequirement: studyAreaRequirement,
            financialNeed: financialNeed,
            eligibilityOther: eligibilityOther
        }
    }
}