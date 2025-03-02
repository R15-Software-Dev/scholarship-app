import {Student} from "../lambdaFunctions/types/types";
import {InputElement} from "../customElements/InputElement";

document.addEventListener('DOMContentLoaded', async () => {
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
    document.cookie = loginResponse.id_token;
    const idToken = document.cookie.match(/.*idToken=([^;]+).*/)[1];

    // Initialize form.
    await fetch("/students/info/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    })
      .then(async res => await res.json() as Student)
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
    console.log("hiding loader");
    loader.fadeOut("fast");
  }
});