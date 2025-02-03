import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { AWSRequest, AWSResponse } from "../types/types";

const client = new DynamoDBClient({ region: "us-east-1" });


export async function handler(event: AWSRequest): Promise<AWSResponse> {
  // The only value for this function will be the email.
  const value = JSON.parse(event.body);

  if (!value.email) throw new Error("Incorrectly formatted request.");

  // Check if the user exists in the users table
  try {
    let dbresponse = await client.send(new GetItemCommand({
      TableName: "scholarship-providers",
      Key: {
        Email: { S: value.email }
      },
      AttributesToGet: [
        "Email"
      ]
    }));

    if (!dbresponse.Item) throw new Error("User not found");

    // Generate and add the token to the reset table
    dbresponse = await client.send(new PutItemCommand({
      TableName: "scholarship-providers-reset",
      Item: {
        ResetToken: { S: "" },
        Email: { S: dbresponse.Item.Email.S }
      },
      ConditionExpression: "attribute_not_exists(ResetToken)"
    }));

    // Email the user at the given email address
    const emailCommand = new SendEmailCommand({
      "Destination": {
        "ToAddresses": [
          value.email
        ]
      },
      "Message": {
        "Body": {
          "Text": {
            "Charset": "UTF-8",
            "Data": "We'll put some generic message here. This is a placeholder for now.\n\nThis is an automated email, please do not respond."
          }
        },
        "Subject": {
          "Charset": "UTF-8",
          "Data": "Testing Password Reset"
        }
      },
      "Source": "scholarships@region15.org"
    });

    

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" })
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
}

