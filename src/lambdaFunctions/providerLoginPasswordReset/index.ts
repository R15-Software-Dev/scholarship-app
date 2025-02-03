import { AWSRequest, AWSResponse } from "../types/aws";
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import * as bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

const client = new DynamoDBClient({ region: "us-east-1" });
const secretsClient = new SecretsManagerClient({ region: "us-east-1" });


export async function handler(event: AWSRequest): Promise<AWSResponse> {
  // Get the information
  const values = JSON.parse(event.body);

  if (!values.email || !values.password || !values.newPassword)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid request"
      })
    }

  // Check if the password matches
  try {
    const dbresponse = await client.send(new GetItemCommand({
      TableName: "scholarship-providers",
      Key: {
        "Email": { S: values.email }
      },
      AttributesToGet: [
        "Email",
        "Password",
        "ExpiredPassword",
        "ScholarshipID"
      ]
    }));

    if (!dbresponse.Item)
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "User not found"
        })
      }

    if (await bcrypt.compare(values.password, dbresponse.Item.Password.S) === false) {
      // Password is incorrect, return failure.
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Incorrect password"
        })
      };
    }

    // Hash the new password
    const hashedPassword = await hashPassword(values.newPassword);
    
    // Reset the password in the database to the newly entered one.
    await client.send(new UpdateItemCommand({
      TableName: "scholarship-providers",
      Key: {
        "Email": { S: values.email }
      },
      ExpressionAttributeNames: {
        "#newPassword": "Password",
        "#expPassword": "ExpiredPassword"
      },
      ExpressionAttributeValues: {
        ":newPassword": { S: hashedPassword },
        ":expPassword": { BOOL: false }
      },
      UpdateExpression: "SET #newPassword = :newPassword," +
        "#expPassword = :expPassword"
    }));

    // Create an authentication token for the user.
    // Get the secret from AWS Secrets Manager
    const secretResponse = await secretsClient.send(new GetSecretValueCommand({
      SecretId: "providerjwt"
    }));
    const secret = new TextEncoder().encode(secretResponse.SecretString);

    const token = await new SignJWT({
      Email: values.email
    }).setIssuedAt()
      .setIssuer("https://smwldja6ql.execute-api.us-east-1.amazonaws.com/sclshp-form/login")
      .setAudience("https://alphafetus-testbucket.s3.amazonaws.com/entryPortal.html")
      .setExpirationTime("1w")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    // Get the token's expiration date
    const expTime = new Date();
    expTime.setDate(expTime.getDate() + 7);

    // Return the information and allow the user to continue.
    return {
      statusCode: 200,
      multiValueHeaders: {
        "Set-Cookie": [
          `authToken=${token}; Expires=${expTime}; Secure; HttpOnly`,
          `scholarshipID=${dbresponse.Item.ScholarshipID.S}; Expires=${expTime}; Secure; HttpOnly`
        ]
      },
      body: JSON.stringify({
        message: "Success"
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
}


async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}
