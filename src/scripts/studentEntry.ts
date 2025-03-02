import {Student} from "../lambdaFunctions/types/types";
import {InputElement} from "../customElements/InputElement";

document.addEventListener('DOMContentLoaded', async () => {
  // Log in user.
  const authCode = new URLSearchParams(window.location.search).get("code");
  await fetch("/students/login", {
    method: "POST",
    body: JSON.stringify({
      code: authCode
    })
  });

  // Initialize form.
  await fetch("/students/info/all", {
    method: "GET"
  })
    .then(async res => await res.json() as Student)
    .then(json => {
      Object.entries(json).forEach(([key, value]) => {
        console.log(key, value);
        if (value) {
          const element = document.querySelector(`[name="${key}"]`) as InputElement;
          if (element) {
            console.log("found element", element);
            element.value = value;
          }
        }
      })
    })
    .catch(err => console.log(err));
});