import * as jose from "jose";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";


// Create a DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });
// Create a Secrets client
const secretClient = new SecretsManagerClient({ region: "us-east-1" });

/**
 * Checks login information and creates a JWT for authorization
 *
 * @param event - Event body from API request
 * @returns A JWT with the user's information or an authorization error
 * @type {(event: AuthProvider) => string | Error}
 */
export const handler = async (event) => {
  console.log("Recieved event: ");
  console.log(event);
  // Create command to get user information
  const getCommand = new GetItemCommand({
    TableName: "scholarship-providers",
    Key: {
      Email: { S: event.email },
    },
    AttributesToGet: [
      "Password",
      "Email",
    ]
  });

  // Send command to DynamoDB and check if the password matches
  const dbresponse = await client.send(getCommand);
  console.log("Database response: ");
  console.log(dbresponse);
  if (dbresponse.Item.Password.S !== event.password ||
    dbresponse.Item.Email.S !== event.email) {
    throw Error("Password does not match");
  }

  // If password matches, get the secret from Secrets Manager
  const secretResponse = await secretClient.send(new GetSecretValueCommand({
    SecretId: "providerjwt"
  }));
  const secret = new TextEncoder().encode(secretResponse.SecretString);

  // Create JWT and return it
  const token = await new jose.SignJWT({
    sub: dbresponse.Item.UserID.N,
    email: dbresponse.Item.Email.S
  })
  .setIssuedAt()
  .setIssuer("https://smwldja6ql.execute-api.us-east-1.amazonaws.com/sclshp-form/login")
  .setAudience("https://alphafetus-testbucket.s3.amazonaws.com/entryPortal.html")
  .setExpirationTime("1w")
  .setProtectedHeader({ alg: "HS256" })
  .sign(secret);

  // Return the JWT - this should be stored in the client's local storage
  return token;
}

/**
* Template class for the authentication request body.
*/
class AuthProvider {
  /**
  * Email address of the user
  * @type {string}
  */
  email = "";

  /**
  * Password of the user. This should already be hashed.
  * @type {string}
  */
  password = "";
}
