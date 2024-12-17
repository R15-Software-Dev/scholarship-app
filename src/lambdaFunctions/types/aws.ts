/**
* This type will allow Typescript to pick up on pieces of an API request.
*/
export type AWSRequest = {
  body?: string;
  headers?: {
    [key: string]: string;
  },
  httpMethod?: string,
  isBase64Encoded?: boolean,
}

/**
* This type will allow Typescript to create a response to an API request.
*/
export type AWSResponse = {
  body: string;
  headers?: {
    [key: string]: string;
  },
  statusCode: number,
}

/**
 * This type represents the structure of an AWS authentication request.
 * It should only be used by the authorizer function.
 */
export type AWSAuthRequest = {
  authorizationToken: string;
  methodArn: string;
  type: string;
}

/**
 * This type represents the structure of an AWS authentication response.
 * It should only be used by the authorizer function.
 */
export type AWSAuthResponse = {
  principalId: string;
  policyDocument: {
    Version: string;
    Statement: [
      {
        Action: string;
        Effect: string;
        Resource: string;
      }
    ]
  }
}