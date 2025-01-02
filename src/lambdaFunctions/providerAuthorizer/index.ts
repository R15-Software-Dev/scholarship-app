import { jwtVerify } from "jose";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import {AWSAuthRequest, AWSAuthResponse } from "./../types/types";


// Create an AWS Secrets Manager client.
const secretClient = new SecretsManagerClient({ region: "us-east-1" });

/**
* Checks if a token has the correct signature and is not expired
* @param event - Event body from API request. Should include a token field.
* @returns A boolean indicating if the token is valid
* @type {(event: { token: string }) => boolean}
*/
export async function handler(event: AWSAuthRequest): Promise<AWSAuthResponse> {
  // console.log("Recieved event: ");
  // console.log(event);

  // Create a command to get the providerjwt secret from AWS.
  // More info can be found here:
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/secrets-manager/command/GetSecretValueCommand/
  const secretResponse = await secretClient.send(new GetSecretValueCommand({
    SecretId: "providerjwt"
  }));
  const secret = new TextEncoder().encode(secretResponse.SecretString);

  // Check the cookie header to see if it is valid
  // First, get the authToken cookie
  const authToken = event.authorizationToken.match(/authToken=([^;]*)/)[1];
  // Then try to verify it - this will throw an error if it doesn't work.
  try {
    let {payload, protectedHeader} = await jwtVerify(authToken, secret, {
      issuer: "https://smwldja6ql.execute-api.us-east-1.amazonaws.com/sclshp-form/login",
      audience: "https://alphafetus-testbucket.s3.amazonaws.com/entryPortal.html"
    });
  } catch (e) {
    // Handle the error - we'll return a policy document that denies invoke access to the requested function.
    // return {
    //   principalId: "user",
    //   policyDocument: {
    //     Version: "2012-10-17",
    //     Statement: [
    //       {
    //         Action: "execute-api:Invoke",
    //         Effect: "Deny",
    //         Resource: event.methodArn
    //       }
    //     ]
    //   }
    // };
    throw new Error("Unauthorized");
  }

  // If valid, return a response with a proper policy document.
  // This follows the documentation found here:
  // https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn
        }
      ]
    }
  };
}
