import {Student} from "../lambdaFunctions/types/types";
import {InputElement} from "../customElements/InputElement";

function redirectToLogin() {
  window.location.href =
    "https://us-east-1lfjuy5zam.auth.us-east-1.amazoncognito.com/login?client_id=4bi5clfnmk0qflgvqd8aetok86&redirect_uri=https%3A%2F%2Fd141lbmc73edje.cloudfront.net%2FstudentEntry.html&response_type=code&scope=email+openid+profile";
}

document.addEventListener('DOMContentLoaded', async () => {
  $("form-section").on("unauthorized", event => {
    // Redirect to the login page. This is annoying, but it'll work for now.
    redirectToLogin();
  });

  const loader = $(".loader");
  loader.show();
  try {
    // Log in user.
    const authCode = new URLSearchParams(window.location.search).get("code");
    const loginResponse = await fetch("/students/login", {
      method: "POST",
      body: JSON.stringify({
        code: authCode
      })
    }).then(response => response.json());

    // Check for id token
    let idToken = "";
    document.cookie = loginResponse.id_token;
    if (document.cookie.includes("idToken")) {
      idToken = document.cookie.match(/.*idToken=([^;]+).*/)[1];
    }

    // Initialize form.
    await fetch("/students/info/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    })
      .then(async res => {
        if (res.ok) {
          return await res.json() as Student
        } else {
          if (res.status == 401) {
            redirectToLogin();
          }
        }
      })
      .then(json => {
        Object.entries(json).forEach(([key, value]) => {
          if (value) {
            const element = document.querySelector(`[name="${key}"]`) as InputElement;
            if (element) {
              element.value = value;
            }
          }
        })
      })
      .catch(err => console.log(err));
  } catch (err) {
    console.log(err);
  } finally {
    loader.fadeOut("fast");
  }
});