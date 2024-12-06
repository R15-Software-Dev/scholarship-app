import * as jose from "jose";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";


// Create a DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Checks login information and creates a JWT for authorization
 *
 * @param event - Event body from API request
 * @returns A JWT with the user's information or an authorization error
 * @type {(event: AuthProvider) => string | Error}
 */
export const handler = async (event) => {
  try {
    console.log("Recieved event: ");
    console.log(event);
    // Create command to get user information
    const getCommand = GetItemCommand({
      TableName: "scholarship-providers",
      Key: {
        email: { S: event.email }
      },
      AttributesToGet: [
        "Password",
        "Username",
        "Email",
        "UserID"
      ]
    });

    // Send command to DynamoDB and check if the password matches
    const dbresponse = await client.send(getCommand);
    if (dbresponse.Item.Password.S !== event.password ||
      dbresponse.Item.Email.S !== event.email) {
      return "Password does not match";
    }

    // If password matches, get the secret from Secrets Manager
    const secretResponse = await secretClient.send(new GetSecretValueCommand({
      SecretId: "providerjwt"
    }));
    const secret = secretResponse.SecretString;

    // Create JWT and return it
    const token = await jose.jwtSign({
      iss: "https://smwldja6ql.execute-api.us-east-1.amazonaws.com/sclshp-form/login",
      aud: "https://alphafetus-testbucket.s3.amazonaws.com/entryPortal.html",
      sub: dbresponse.Item.UserID.S,
      user: dbresponse.Item.Username.S,
      email: dbresponse.Item.Email.S
    }).setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("https://smwldja6ql.execute-api.us-east-1.amazonaws.com/sclshp-form/login")
    .setAudience("https://alphafetus-testbucket.s3.amazonaws.com/entryPortal.html")
    .setExpirationTime("1w")
    .sign(secret);

    // Return the JWT - this should be stored in the client's local storage
    return token;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
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
