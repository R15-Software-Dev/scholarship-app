import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';


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
        return dbresponse;
    } catch (e) {
        console.error(e.message);
        throw new Error(e.message);
    }
}
