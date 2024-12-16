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
  // // Get the secret from Secrets Manager
  // const secretResponse = await secretClient.send(new GetSecretValueCommand({
  //   SecretId: "providerjwt"
  // }));
  // const secret = new TextEncoder().encode(secretResponse.SecretString);
  //
  // // Verify the token
  // // TODO Put real values in the iss and aud fields
  // let { payload, protectedHeader } = await jwtVerify(event.token, secret, {
  //   iss: "https://smwldja6ql.execute-api.us-east-1.amazonaws.com/login",
  //   aud: "https://alphafetus-testbucket.s3.amazonaws.com/entryPortal.html"
  // });
  //
  // console.log(payload);

  // Check the cookie header to see if it is valid
  const token: string = event.authorizationToken;

  // If invalid, disallow
  if (!token)
    throw new Error('Unauthorized');

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
