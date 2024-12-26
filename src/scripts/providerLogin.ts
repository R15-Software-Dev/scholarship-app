import { FormQuestion } from "../customElements/Forms";

$(function() {

  // We will need to get the values for the form submission manually
  // Set up a listener on the login form
  $("#login-form").on("submit", async (event) => {
    event.preventDefault();

    // Get the values from the form elements.
    const emailInput = this.querySelector("#loginEmailInput") as FormQuestion;
    const passwordInput = this.querySelector("#loginPasswordInput") as FormQuestion;

    const values = {
      email: emailInput.input.getValue(),
      password: passwordInput.input.getValue(),
    };

    // Only for debugging.
    console.log(values);

    // Send these values to the API and wait for a response.
    // We'll react to the response's statusCode accordingly.
    // The API url will need to match our API's url and be tested through AWS as well.
    const pendingButton = $('#loginButton');
    const loginErrorDiv = $('#divErrorLogin');

    try {
      pendingButton.addClass("disabled");
      loginErrorDiv.removeClass('shown');
      const response = await fetch("/api/providers/login", {
        method: "POST",
        body: JSON.stringify(values)
      });

      const responseJson = await response.json();

      if (responseJson.message === "Login successful") {
        // Redirect to the entryPortal page.
        window.location.replace("./entryPortal.html");

      } else {
        loginErrorDiv.html(responseJson.message);
        loginErrorDiv.addClass("shown");
      }
    } catch (e) {
       console.log("Caught statement");
    }
    finally {
      pendingButton.removeClass("disabled");
    }
  });

  $("#registration-form").on("submit", async (event) => {
    event.preventDefault();

    // We will check that the password fields are the same.
    const emailInput = this.querySelector("#registerEmailInput") as FormQuestion;
    const passwordInputOne = this.querySelector("#registerPasswordInput") as FormQuestion;
    const passwordInputTwo = this.querySelector("#registerConfirmPasswordInput") as FormQuestion;

    const email = emailInput.input.getValue();
    const password = passwordInputOne.input.getValue();
    const passwordConfirm = passwordInputTwo.input.getValue();

    const noMatch = $('#mismatchedPasswords');
    const accountExist = $('#registeredEmailError');

    if (password === passwordConfirm) {
      noMatch.removeClass("error");
      // Make the request.
      const request = {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password
        })
      };

      const response = await fetch("/api/providers/registration", request);
      const responseJson = await response.json();
      if (responseJson.message === "Registration successful") {
        window.location.replace("./entryPortal.html");
        accountExist.removeClass("error");
      } else if (responseJson.name === "ConditionalCheckFailedException") { //Checks if account already exists
        accountExist.addClass("error");
      }
    } else {
      noMatch.addClass("error");
      console.log("Passwords don't match");
    }
  });
})