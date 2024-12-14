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
