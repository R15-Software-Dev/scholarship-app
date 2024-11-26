import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({ region: "us-east-1" });

export async function handler(event) {
    try {
        const input = JSON.parse(event.body);

        const command = new PutItemCommand({
            TableName: "scholarship-info",
            Item: {
                studentAidReport: {BOOL: input.studentAidReport},
                studentInterviews: {BOOL: input.studentInterviews},
                recipientSelection: {S: input.recipientSelection},
                transcriptRequirements: {BOOL: input.transcriptRequirements},
                awardTo: {BOOL: input.awardTo},
                sclshpReApplication: {BOOL: input.sclshpReApplication},
                essayRequirement: {BOOL: input.essayRequirement},
                essaySelection: {SS: input.essaySelection},
                awardNightRemarks: {S: input.awardNightRemarks}
            }
        });

        const dbresponse = await client.send(command);
        return dbresponse;
    } catch (e) {
        console.error(e.message);
        throw new Error(e.message);
    }
}
