async function getToken(authCode: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: "4bi5clfnmk0qflgvqd8aetok86",
      code: authCode,
      redirect_uri: "https://d141lbmc73edje.cloudfront.net/studentEntry.html",
      client_secret: "eb2qkr8blp0akim759q4iv2vdnotdllo1lqb3gvjlq8u72krjqa"
    });

    const response = await fetch(
      "https://us-east-1lfjuy5zam.auth.us-east-1.amazoncognito.com/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString()
      }).then(r => r.json())
      .then(json => {
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7);
        document.cookie = `authToken=${json.access_token}; Expires=${expireDate.toUTCString()}; Secure;`;
      });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
// Check the url to get the authorization code.
  const authCode = new URLSearchParams(window.location.search).get("code");
  await getToken(authCode);
  await fetch("/students/info/all", {
    method: "POST"
  })
    .then(res => res.json())
    .then(json => {
      console.log(json);
    })
    .catch(err => console.log(err));
});