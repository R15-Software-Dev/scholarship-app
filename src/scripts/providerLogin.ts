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
    // console.log(values);

    // Send these values to the API and wait for a response.
    // We'll react to the response's statusCode accordingly.
    // The API url will need to match our API's url and be tested through AWS as well.
    const pendingButton = $('#loginButton');
    const loginErrorDiv = $('#divErrorLogin');

    try {
      pendingButton.addClass("disabled");
      loginErrorDiv.removeClass('shown');
      const response = await fetch("/providers/login", {
        method: "POST",
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        // This means there's something wrong with the api.
        // TODO Show some error.
      }

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
    const form = document.querySelector("#registration-form");
    const allQuestions = form.querySelectorAll("form-question") as NodeListOf<FormQuestion>;
    const emailInput = (this.querySelector("#registerEmailInput") as FormQuestion).input;
    const passwordInputOne = (this.querySelector("#registerPasswordInput") as FormQuestion).input;
    const passwordInputTwo = (this.querySelector("#registerConfirmPasswordInput") as FormQuestion).input;

    const email = emailInput.getValue();
    const password = passwordInputOne.getValue();
    const passwordConfirm = passwordInputTwo.getValue();

    const noMatch = $('#mismatchedPasswords');
    const accountExist = $('#registeredEmailError');

    allQuestions.forEach((question) => question.input.clearError());

    let submittable = true;
    allQuestions.forEach((question) => {
      // Verify that the question is valid.
      if (!question.checkValidity()) {
        // Display the error
        console.log("Found invalid question " + question.id);
        question.input.displayError("Invalid input");
        submittable = false;
      }
    });

    if (submittable) {
      if (password === passwordConfirm) {
        console.log("Passwords match");
        // noMatch.removeClass("shown");
        // Make the request.
        const request = {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password
          })
        };

        const response = await fetch("/providers/registration", request);
        if (!response.ok) {
          // TODO Show an error message.
        }

        const responseJson = await response.json();
        if (responseJson.message === "Registration successful") {
          window.location.replace("./entryPortal.html");
          accountExist.removeClass("error");
        } else if (responseJson.name === "ConditionalCheckFailedException") { //Checks if account already exists
          accountExist.addClass("error");
        }
      } else {
        // noMatch.addClass("shown");
        passwordInputOne.displayError("Passwords do not match");
        passwordInputTwo.displayError("Passwords do not match");
        console.log("Passwords don't match");
      }
    } else {
      console.log("Form is not submittable");
    }
  });
})