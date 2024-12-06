import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the scholarship info table in DynamoDB
 * @param {ScholarshipRequirements} event - A scholarship requirements object
 * @returns DynamoDB response object
 */
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

class ScholarshipRequirements {
    constructor(
        studentAidReport,
        studentInterviews,
        recipientSelection,
        transcriptRequirements,
        awardTo,
        sclshpReApplication,
        essayRequirement,
        essaySelection,
        awardNightRemarks) {
        return {
            studentAidReport: studentAidReport,
            studentInterviews: studentInterviews,
            recipientSelection: recipientSelection,
            transcriptRequirements: transcriptRequirements,
            awardTo: awardTo,
            sclshpReApplication: sclshpReApplication,
            essayRequirement: essayRequirement,
            essaySelection: essaySelection,
            awardNightRemarks: awardNightRemarks

        }
    }
}
