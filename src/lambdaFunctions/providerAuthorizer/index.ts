import { jwtVerify } from "jose";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import {AWSAuthRequest, AWSAuthResponse } from "./../types/types";


const secretClient = new SecretsManagerClient({ region: "us-east-1" });

/**
* Checks if a token has the correct signature and is not expired
* @param event - Event body from API request. Should include a token field.
* @returns A boolean indicating if the token is valid
* @type {(event: { token: string }) => boolean}
*/
export async function handler(event: AWSAuthRequest): Promise<AWSAuthResponse> {
  console.log("Recieved event: ");
  console.log(event);
  // Get the secret from Secrets Manager
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
    console.error(e);
    throw new Error('Unauthorized');
  }

  // If valid, return a response with a proper policy document.
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
