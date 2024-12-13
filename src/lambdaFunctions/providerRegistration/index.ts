const { DynamoDBClient, GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");

// Create a DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Registers a provider in the database
 *
 * @param event - Event body from API request
 * @returns A success message or an error
 */
async function handler(event: Provider) {
  // console.log(event);
  // Check if the event fits the Provider class.
  if (!event.email || !event.password ||
    event.email === "" || event.password === "")
    throw new Error(`Invalid input: ${event}`);

  // Create a command to check if the provider is already registered.
  // If the provider is already registered, return an error and do not register them again.
  const getCommand = new GetItemCommand({
    TableName: "scholarship-providers",
    Key: {
      Email: { S: event.email }
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
        Email: { S: event.email },
        Password: { S: event.password }
      }
    });

    // Send command to DynamoDB
    dbresponse = await client.send(putCommand);

    return "Provider registered successfully";
  }

  return "Provider already registered";
}

class Provider {
  /**
   * Email address of the provider.
   * @type {string}
   */
  email = "";

  /**
   * Password of the provider.
   * This value should be hashed before being sent here.
   * @type {string}
   */
  password = "";
}


module.exports = { handler, Provider };
