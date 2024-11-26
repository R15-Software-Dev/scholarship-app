import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({ region: "us-east-1" });

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
