import { sign } from "jsonwebtoken";
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

    // Create JWT and return it
    // TODO Put real values in the iss and aud fields
    const token = sign({
      iss: "api/url/path",
      sub: dbresponse.Item.UserID.S,
      name: dbresponse.Item.Username,
      aud: "login/website/path",
    });

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
