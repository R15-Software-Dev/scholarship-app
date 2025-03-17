import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {AWSRequest, AWSResponse} from "../../types/aws";

const handler = require("./../index").handler;

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
