import { DynamoDBClient, DeleteItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {AWSRequest, AWSResponse} from "../../types/aws";

const handler = require("./../index").handler;
const client = new DynamoDBClient({ endpoint: "http://localhost:8000" })

const getRequest = (overrides: any): APIGatewayProxyEvent => {
  const defaultEvent: APIGatewayProxyEvent = {
    headers: {},
    multiValueHeaders: {},
    httpMethod: "POST",
    pathParameters: {},
    isBase64Encoded: false,
    path: "/providers/registration",
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    resource: "",
    stageVariables: {},
    requestContext: {
      accountId: "",
      apiId: "",
      authorizer: null,
      protocol: "",
      httpMethod: "",
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: "",
        user: null,
        userAgent: null,
        userArn: null
      },
      path: "",
      stage: "",
      requestId: "",
      requestTimeEpoch: 0,
      resourceId: "",
      resourcePath: ""
    },
    body: JSON.stringify({
      email: ""
    })
  };

  return {...defaultEvent, ...overrides};
}

test("throws error with no object", async () => {
  await expect(handler()).rejects.toThrow();
});

test("throws error with empty object", async () => {
  await expect(handler({})).resolves.toHaveProperty("statusCode", 400);
});

test("throws error with incorrect input", async () => {
  const badRequest = getRequest({
    body: JSON.stringify({
      email: ""
    })
  });

  await expect(handler(badRequest)).resolves.toHaveProperty("statusCode", 400);
  await expect(handler({ email: "hello@gmail.com", password: "" })).resolves.toHaveProperty("statusCode", 400);
  await expect(handler({ email: "", password: "blahblahblah" })).resolves.toHaveProperty("statusCode", 400);
  await expect(handler({})).resolves.toHaveProperty("statusCode", 400);
});

test("user is saved with correct input", async () => {
  const request: AWSRequest = {
    body: JSON.stringify({
      email: "testuser@nodejstesting.com",
      password: "something"
    }),
    httpMethod: "POST"
  };

  await expect(handler(request)).resolves.toHaveProperty("statusCode", 200);
  await expect(client.send(new GetItemCommand({
    TableName: "scholarship-providers",
    Key: {
      "Email": { S: "testuser@nodejstesting.com" }
    }
  })))
    .resolves.toHaveProperty("Item.Email.S", "testuser@nodejstesting.com");

  // Delete the created user
  await client.send(new DeleteItemCommand({
    TableName: "scholarship-providers",
    Key: {
      Email: { S: "testuser@nodejstesting.com" }
    }
  }));
});