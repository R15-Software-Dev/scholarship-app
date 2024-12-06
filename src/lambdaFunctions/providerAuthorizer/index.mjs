import * as jose from "jose";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";


const secretClient = new SecretsManagerClient({ region: "us-east-1" });

/**
* Checks if a token has the correct signature and is not expired
* @param event - Event body from API request. Should include a token field.
* @returns A boolean indicating if the token is valid
* @type {(event: { token: string }) => boolean}
*/
export const handler = async (event) => {
  console.log("Recieved event: ");
  console.log(event);
  // Get the secret from Secrets Manager
  const secretResponse = await secretClient.send(new GetSecretValueCommand({
    SecretId: "providerjwt"
  })
  );
  const secret = secretResponse.SecretString;

  // Verify the token
  // TODO Put real values in the iss and aud fields
  let { payload, protectedHeader } = jose.jwtVerify(event.token, secret, {
    iss: "https://smwldja6ql.execute-api.us-east-1.amazonaws.com/login",
    aud: "https://alphafetus-testbucket.s3.amazonaws.com/entryPortal.html"
  });

  console.log(payload);
  return true;
}
