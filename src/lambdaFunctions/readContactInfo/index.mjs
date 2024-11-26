import {DynamoDBClient, GetItemCommand} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: "us-east-1" });

// Designed for use with a POST request.
export async function handler(event) {

    const input = JSON.parse(event.body);

    console.log("Creating command");
    const command = new GetItemCommand({
        TableName: "contact-info",
        Item: {
            contact: {S: input.contact},
            contactBusiness: {S: input.contactBusiness},
            address: {S: input.address},
            homePhone: {S: input.homePhone},
            businessPhone: {S: input.businessPhone},
            cellPhone: {S: input.cellPhone},
            email: {S: input.email}
        }
    });

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "https://alphafetus-testbucket.s3.amazonaws.com/",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        body: "",
    };

    try {
        console.log("Sending request");
        const dbresponse = await client.send(command);
        response.statusCode = dbresponse.$metadata.httpStatusCode;
        response.body = JSON.stringify(dbresponse);
    } catch (e) {
        console.error(e);
        response.statusCode = e.$metadata.httpStatusCode;
        response.body = JSON.stringify(e.message);
    }

    return response;
}