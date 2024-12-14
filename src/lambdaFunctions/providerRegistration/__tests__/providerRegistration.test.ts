import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { AWSRequest, AWSResponse } from "./../../types";

const handler = require("./../index").handler;

// Test an input to a function
test("throws error with no object", async () => {
  await expect(handler()).rejects.toThrow();
});

test("throws error with empty object", async () => {
  await expect(handler({})).rejects.toThrow();
});

test("throws error with incorrect input", async () => {
  const badRequest: AWSRequest = {
    body: JSON.stringify({
      email: ""
    })
  };

  await expect(handler(badRequest)).rejects.toThrow();
  await expect(handler({ email: "hello@gmail.com", password: "" })).rejects.toThrow();
  await expect(handler({ email: "", password: "blahblahblah" })).rejects.toThrow();
  await expect(handler({})).rejects.toThrow();
});

test("returns 'Provider registered successfully' with correct input", async () => {
  const request: AWSRequest = {
    body: JSON.stringify({
      email: "testuser@nodejstesting.com",
      password: "something"
    }),
    httpMethod: "POST"
  };

  const expectedResponse: AWSResponse = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Provider registered successfully"
    })
  };

  await expect(handler(request)).resolves.toStrictEqual(expectedResponse);

  // Delete the created user
  await new DynamoDBClient({ region: "us-east-1" }).send(new DeleteItemCommand({
    TableName: "scholarship-providers",
    Key: {
      Email: { S: "testuser@nodejstesting.com" }
    }
  }));
});
