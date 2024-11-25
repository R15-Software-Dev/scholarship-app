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
        return buildResponse(dbresponse.$metadata.httpStatusCode, dbresponse);
    } catch (e) {
        console.log("Error: " + JSON.stringify(e));
        return buildResponse(500, {ErrorMessage: e.message, EventBody: event.body});
    }
};

const buildResponse = (statusCode, bodyContent) => {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "https://alphafetus-testbucket.s3.amazonaws.com",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        body: JSON.stringify(bodyContent)
    };
};