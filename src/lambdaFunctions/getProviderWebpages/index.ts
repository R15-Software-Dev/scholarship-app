import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {AWSRequest, AWSResponse} from "../types/aws";


// Create an S3 client
const s3_client = new S3Client({ region: "us-east-1" });

export async function handler(event: AWSRequest): Promise<AWSResponse> {
  // First, get the path of the file that we want.
  const proxyValue = event.pathParameters.proxy;

  console.log("Attempting to get file " + proxyValue);

  // Get the contents of the file from our S3 bucket.
  // This does require a reference of some sort to the bucket.
  const command = new GetObjectCommand({
    // Bucket: process.env.AWS_BUCKET_NAME,
    Bucket: "alphafetus-testbucket",
    Key: `WebsiteBuildGithub/${proxyValue}.html`,
    ResponseContentType: "text/html"
  });

  // Send the command to S3
  const s3response = await s3_client.send(command);

  console.log(s3response);

  const body = await s3response.Body.transformToString();

  // Construct an appropriate body for the client to process this as
  // a webpage
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html"
    },
    body: body
  }
}