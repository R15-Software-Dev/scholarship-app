import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const handler = require("./../index").handler;

// Test an input to a function
test("throws error with no object", async () => {
  await expect(handler()).rejects.toThrow();
});

test("throws error with empty object", async () => {
  await expect(handler({})).rejects.toThrow();
});

test("throws error with incorrect input", async () => {
  await expect(handler({ email: "hello@gmail.com", password: "" })).rejects.toThrow();
  await expect(handler({ email: "", password: "blahblahblah" })).rejects.toThrow();
  await expect(handler({})).rejects.toThrow();
});

test("returns 'Provider registered successfully' with correct input", async () => {
  // return expect(Promise.resolve("hello")).resolves.toBe("hello");
  await expect(handler({ email: "testuser@nodejstesting.com", password: "something" })).resolves.toBe("Provider registered successfully");
  // Delete the created user
  await new DynamoDBClient({ region: "us-east-1" }).send(new DeleteItemCommand({
    TableName: "scholarship-providers",
    Key: {
      Email: { S: "testuser@nodejstesting.com" }
    }
  }));
});
