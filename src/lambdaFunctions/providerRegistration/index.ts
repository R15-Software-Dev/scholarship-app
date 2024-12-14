import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse } from "./../types";

// Create a DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Registers a provider in the database
 *
 * @param event - Event body from API request
 * @returns A success message or an error
 */
export async function handler(event: AWSRequest): Promise<AWSResponse> {
  // Parse into a ProviderRegInfo object
  const eventBody: ProviderRegInfo = JSON.parse(event.body);
  if (!eventBody.email || !eventBody.password ||
    eventBody.email === "" || eventBody.password === "")
    throw new Error(`Invalid input: ${eventBody}`);

  // Create a command to check if the provider is already registered.
  // If the provider is already registered, return an error and do not register them again.
  const getCommand = new GetItemCommand({
    TableName: "scholarship-providers",
    Key: {
      Email: { S: eventBody.email }
    },
    AttributesToGet: [
      "Email"
    ]
  });

  // Send command to DynamoDB
  let dbresponse = await client.send(getCommand);

  // If the provider is already registered, return an error
  if (!dbresponse.Item) {
    // Create a command to add the provider to the database
    const putCommand = new PutItemCommand({
      TableName: "scholarship-providers",
      Item: {
        Email: { S: eventBody.email },
        Password: { S: eventBody.password }
      }
    });

    // Send command to DynamoDB
    dbresponse = await client.send(putCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Provider registered successfully"
      })
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Provider already registered"
    })
  };
}

class ProviderRegInfo {
  /**
   * Email address of the provider.
   */
  email = "";

  /**
   * Password of the provider.
   * This value should be hashed before being sent here.
   */
  password = "";
}
