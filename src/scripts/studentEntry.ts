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
    .then(res => res.json())
    .then(json => {
      console.log(json);
    })
    .catch(err => console.log(err));
});