import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Creates and or updates a record in the scholarship info table in DynamoDB
 * @param {ScholarshipInfo} event - A scholarship info object
 * @returns DynamoDB response object
 */
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

class ScholarshipInfo{
    constructor(
        sclshpTitle,
        sclshpSponsor,
        sclshpNumAwards,
        sclshpAwardsTotal,
        sclshpAmountPerAward
    ) {
        return {
            sclshpTitle: sclshpTitle,
            sclshpSponsor: sclshpSponsor,
            sclshpNumAwards: sclshpNumAwards,
            sclshpAwardsTotal: sclshpAwardsTotal,
            sclshpAmountPerAward: sclshpAmountPerAward
        }
    }
}
