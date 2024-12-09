import {DynamoDBClient, GetItemCommand} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Reads scholarship provider contact data from the scholarship info table.
 * @param {string} event - The scholarship ID
 * @returns The scholarship provider contact information
 */
export async function handler(event) {

    try {
        const input = JSON.parse(event.body);

        const command = new GetItemCommand({
            TableName: "scholarship-info",
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

        const dbresponse = await client.send(command);
        return dbresponse;
    } catch (e) {
        console.error(e.message);
        throw new Error(e.message);
    }
}