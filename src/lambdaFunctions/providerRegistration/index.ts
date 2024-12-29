import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { AWSRequest, AWSResponse } from "./../types/types";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";

// Create a DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });
// Create a Secrets Manager client
const secretsClient = new SecretsManagerClient({ region: "us-east-1" });

/**
 * Registers a provider in the database
 *
 * @param event - Event body from API request
 * @returns A success message or an error
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  // Parse into a ProviderRegInfo object - ensure that email and password are not empty strings
  let eventBody: ProviderRegInfo = {
    email: "",
    password: ""
  };
  
  if (event.body != null)
    eventBody = JSON.parse(event.body);
  
  if (eventBody.email === "" || eventBody.password === "") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Fields cannot be empty"
      })
    };
  }

  // Create a command to check if the provider is already registered.
  // If the provider is already registered, return an error and do not register them again.
  try {
    // Check if the email already exists
    const getCommand = new GetItemCommand({
      TableName: "scholarship-providers",
      Key: {
        Email: { S: eventBody.email }
      }
    });

    const existingEmail = await client.send(getCommand);

    if (existingEmail.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Email already registered"
        })
      };
    }

    // Proceed with registration if email is not already registered
    // Generate a GUID for the provider's scholarship - this will be used later
    const scholarshipID = uuidv4();
    // Get the hash of the user's password
    const passwordHash = await hashPassword(eventBody.password);
    // Create the command to send to the database client
    const putCommand = new PutItemCommand({
      TableName: "scholarship-providers",
      Item: {
        Email: {S: eventBody.email},
        Password: {S: passwordHash},
        ScholarshipID: {S: scholarshipID}
      },
      ConditionExpression: "attribute_not_exists(Email) AND attribute_not_exists(ScholarshipID)"
    });

    // Send command to Dynamo
    // It should throw an error if the command does not work
    const dbresponse = await client.send(putCommand);

    // If successful, we will also generate and send a JWT corresponding to this user.
    // First get the JWT secret
    const secretResponse = await secretsClient.send(new GetSecretValueCommand({
      SecretId: "providerjwt"
    }));
    const secret = new TextEncoder().encode(secretResponse.SecretString);
    const token = await new SignJWT({
      Email: eventBody.email
    }).setIssuedAt()
      .setIssuer("https://smwldja6ql.execute-api.us-east-1.amazonaws.com/sclshp-form/login")
      .setAudience("https://alphafetus-testbucket.s3.amazonaws.com/entryPortal.html")
      .setExpirationTime("1w")
      .setProtectedHeader({alg: "HS256"})
      .sign(secret);

    // Get the token's expiration date
    const expTime = new Date();
    expTime.setDate(expTime.getDate() + 7);
    
    return {
      statusCode: 200,
      multiValueHeaders: {
        "Set-Cookie": [
          `authToken=${token}; Expires=${expTime}; Secure; HttpOnly`,
          `scholarshipID=${scholarshipID}; Expires=${expTime}; Secure; HttpOnly`
        ]
      },
      body: JSON.stringify({
        message: "Registration successful",
        scholarshipID: scholarshipID
      })
    }
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error"
      })
    };
  }
}

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

type ProviderRegInfo = {
  email: string;
  password: string;
}