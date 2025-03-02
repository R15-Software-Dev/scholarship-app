import {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from "aws-lambda";
import {CognitoIdentityProviderClient, DescribeUserPoolClientCommand} from "@aws-sdk/client-cognito-identity-provider";


const idpClient = new CognitoIdentityProviderClient({ region: "us-east-1" });

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return new Promise<APIGatewayProxyResult>(async (resolve, reject) => {
    // Forward the body to the Cognito authorizer.
    const body = JSON.parse(event.body);
    const authCode = body.code;
    console.log(authCode);
    if (authCode) {
      // Get the information about the user pool client.
      const clientInfo = await idpClient.send(new DescribeUserPoolClientCommand({
        UserPoolId: "us-east-1_Lfjuy5zaM",
        ClientId: process.env.COGNITO_CLIENT_ID
      }));

      await fetch(process.env.COGNITO_AUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: authCode,
          client_id: process.env.COGNITO_CLIENT_ID,
          redirect_uri: "https://d141lbmc73edje.cloudfront.net/studentEntry.html",
          client_secret: clientInfo.UserPoolClient.ClientSecret
        }).toString()
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error(data.error);
            reject({
              statusCode: 401,
              body: JSON.stringify({
                message: data.error
              })
            })
          } else {
            // Build the response which contains the cookies.
            let authCookie = `authToken=${data.access_token}; Secure; HttpOnly`;
            let idCookie = `idToken=${data.id_token}; Secure; HttpOnly`;
            let refreshCookie = `refreshToken=${data.refresh_token}; Secure; HttpOnly`;
            console.log(data);
            resolve({
              statusCode: 200,
              multiValueHeaders: {
                "Set-Cookie": [authCookie, idCookie, refreshCookie]
              },
              body: JSON.stringify({
                access_token: authCookie,
                refresh_token: refreshCookie,
                id_token: idCookie
              })
            });
          }
        })
        .catch(error => {
          console.error(error);
          reject({
            statusCode: error.statusCode,
            body: JSON.stringify(error)
          });
        });
    } else {
      reject({
        statusCode: 401,
        body: JSON.stringify({
          message: "No code received"
        })
      });
    }
  });
}