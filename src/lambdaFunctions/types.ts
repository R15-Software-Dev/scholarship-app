/**
* This interface will allow Typescript to pick up on pieces of an API request.
*/
export interface AWSRequest {
  body: string;
  headers: {
    [key: string]: string;
  },
  httpMethod: string,
  isBase64Encoded: boolean,
}

/**
* This interface will allow Typescript to create a response to an API request.
*/
export interface AWSResponse {
  body: string;
  headers: {
    [key: string]: string;
  },
  statusCode: number,
}
