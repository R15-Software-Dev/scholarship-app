import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the scholarship info table in DynamoDB
 * @param {ScholarshipEligibility} event - A scholarship eligibility object
 * @returns DynamoDB response object
 */
export async function handler(event) {
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

        const dbresponse = await client.send(command);
        return dbresponse;
    } catch (e) {
        console.error(e.message);
        throw new Error(e.message);
    }
}

class ScholarshipEligibility {
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
