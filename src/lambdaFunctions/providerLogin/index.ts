import * as jose from "jose";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { AWSRequest, AWSResponse } from "./../types/types";
import * as bcrypt from "bcryptjs";


// Create a DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });
// Create a Secrets client
const secretClient = new SecretsManagerClient({ region: "us-east-1" });

/**
 * Checks login information and creates a JWT for authorization
 *
 * @param event - Event body from API request
 * @returns A JWT with the user's information or an authorization error
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const eventBody: AuthProviderInfo = JSON.parse(event.body);
  console.log("Event body: ");
  console.log(eventBody);
  
  // Create command to get user information
  const getCommand = new GetItemCommand({
    TableName: "scholarship-providers",
    Key: {
      Email: { S: eventBody.email },
    },
    AttributesToGet: [
      "Password",
      "Email",
    ]
  });

  // Send command to DynamoDB and check if the password matches
  const dbresponse = await client.send(getCommand);
  // Get the password from the response - this will be hashed since it's from the server
  const hashedPassword = dbresponse.Item.Password.S;
  if (await bcrypt.compare(eventBody.password, hashedPassword) === false) {
    // Then the password is incorrect
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Incorrect password"
      })
    };
  }

  // If password matches, get the secret from Secrets Manager
  const secretResponse = await secretClient.send(new GetSecretValueCommand({
    SecretId: "providerjwt"
  }));
  const secret = new TextEncoder().encode(secretResponse.SecretString);

  // Create JWT and return it
  const token = await new jose.SignJWT({
    email: dbresponse.Item.Email.S
  })
  .setIssuedAt()
  .setIssuer("https://smwldja6ql.execute-api.us-east-1.amazonaws.com/sclshp-form/login")
  .setAudience("https://alphafetus-testbucket.s3.amazonaws.com/entryPortal.html")
  .setExpirationTime("1w")
  .setProtectedHeader({ alg: "HS256" })
  .sign(secret);

  // Get the expiration time of the token
  const expTime = new Date();
  expTime.setDate(expTime.getDate() + 7);

  // Return that the login was successful - this should store an HttpOnly Secure cookie
  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": `authToken=${token}; Expires=${expTime}; Secure; HttpOnly`
    },
    body: JSON.stringify({
      message: "Login successful"
    })
  };
}

/**
* Template class for the authentication request body.
*/
type AuthProviderInfo = {
  /**
   * Email address of the user
   */
  email: string;

  /**
   * Password of the user.
   */
  password: string;
}
