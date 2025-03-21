import {
  ConditionalCheckFailedException,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand
} from "@aws-sdk/client-dynamodb";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { AWSRequest, AWSResponse } from "./../types/types";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";


/**
 * Registers a provider in the database
 *
 * @param event - Event body from API request
 * @returns A success message or an error
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  // Create a DynamoDB client
  const client = new DynamoDBClient({ region: "us-east-1", endpoint: "http://localhost:8000" });
  // Create a Secrets Manager client
  const secretsClient = new SecretsManagerClient({ region: "us-east-1" });


  // Parse into a ProviderRegInfo object - ensure that email and password are not empty strings
  let eventBody: ProviderRegInfo = {
    email: "",
    password: ""
  };

  // Make sure that we didn't get a null request.
  if (event.body != null)
    eventBody = JSON.parse(event.body);

  // Ensure that the use did not put in a blank email or password.
  // This should be set from the front end as well, but it's good to be safe.
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
    // It should throw an error if the user is already registered or the scholarship ID already exists.
    // Hopefully the issue is not that the scholarship ID exists, because that's a far harder issue to fix.
    try {
      const dbresponse = await client.send(putCommand);
    } catch (e) {
      if (e instanceof ConditionalCheckFailedException) {
        // return a specific error.
        console.error(e);
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Email already registered"
          })
        }
      }
    }

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

    // Return the correct auth information.
    // This includes the new user's JWT and their scholarship ID, both stored in cookies.
    return {
      statusCode: 200,
      multiValueHeaders: {
        "Set-Cookie": [
          `authToken=${token}; Expires=${expTime}; Secure; HttpOnly`,
          `scholarshipID=${scholarshipID}; Expires=${expTime}; Secure; HttpOnly`
        ]
      },
      body: JSON.stringify({
        message: "Registration successful"
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

/**
 * Simply handles hashing the password.
 * @param password The plaintext password to hash.
 */
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

type ProviderRegInfo = {
  email: string;
  password: string;
}