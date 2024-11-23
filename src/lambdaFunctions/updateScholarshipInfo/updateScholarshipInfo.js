import {DynamoDBClient, GetItemCommand, PutItemCommand} from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({ region: "us-east-1" });

export async function handler(event) {
    try {
        const input = JSON.parse(event.body);

        const command = new PutItemCommand({
            TableName: "scholarship-info",
            Item: {
                sclshpTitle: {S: input.sclshpTitle},
                sclshpSponsor: {S: input.sclshpSponsor},
                sclshpNumAwards: {N: input.sclshpNumAwards},
                sclshpAwardsTotal: {N: input.sclshpAwardsTotal},
                sclshpAmountPerAward: {N: input.sclshpAmountPerAward}
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