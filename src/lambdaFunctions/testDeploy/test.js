// This file should test the ability of Github Actions to deploy to AWS Lambda.

// Parse a JWT
export const handler = async (token) => {
  if (!token || token === "")
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  // Split token
  let parts = token.split('.');
  console.log(parts);

  // Decode token
  // atob decodes a base64 string.
  // the 3rd part is not a string, and we will not decode it.
  let decoded = {};
  decoded.header = JSON.parse(atob(parts[0]));
  decoded.payload = JSON.parse(atob(parts[1]));
  decoded.signature = parts[2];
  console.log(decoded);

  // Return the payload
  return decoded;
}
