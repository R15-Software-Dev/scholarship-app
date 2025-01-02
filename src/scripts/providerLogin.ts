import { FormQuestion } from "../customElements/Forms";

$(function() {
  const allQuestionsGlobal = document.querySelectorAll('form-question') as NodeListOf<FormQuestion>;
  // We will need to get the values for the form submission manually
  // Set up a listener on the login form
  document.querySelector("#login-form").addEventListener("submit", async event => {
  // $("#login-form").on("submit", async (event) => {
    event.preventDefault();

    // Get the values from the form elements.
    const form = event.target as HTMLFormElement;
    const allInputs = form.querySelectorAll("form-question") as NodeListOf<FormQuestion>;
    const emailInput = this.querySelector("#loginEmailInput") as FormQuestion;
    const passwordInput = this.querySelector("#loginPasswordInput") as FormQuestion;

    allInputs.forEach(question => question.input.clearError());

    // Check validity of inputs
    let submittable = true;
    allInputs.forEach((question) => {
      if (!question.checkValidity()) {
        submittable = false;
        question.input.displayError("Invalid input");
      }
    })

    if (submittable) {
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
          loginErrorDiv.removeClass("shown");
        } else {
          loginErrorDiv.html(responseJson.message)
            .addClass("shown");
        }
      } catch (e) {
        console.log(e);
      } finally {
        pendingButton.removeClass("disabled");
      }
    }
  });

  document.querySelector("#registration-form").addEventListener("submit", async event => {
  // $("#registration-form").on("submit", async (event) => {
    event.preventDefault();

    // We will check that the password fields are the same.
    const form = event.target as HTMLFormElement;
    const allQuestions = form.querySelectorAll("form-question") as NodeListOf<FormQuestion>;
    const emailInput = (this.querySelector("#registerEmailInput") as FormQuestion).input;
    const passwordInputOne = (this.querySelector("#registerPasswordInput") as FormQuestion).input;
    const passwordInputTwo = (this.querySelector("#registerConfirmPasswordInput") as FormQuestion).input;

    const email = emailInput.getValue();
    const password = passwordInputOne.getValue();
    const passwordConfirm = passwordInputTwo.getValue();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const registerErrorDiv = $('#divErrorRegister');
    const pendingButton = $('#registerButton');

    try {
      registerErrorDiv.removeClass("shown");
      pendingButton.addClass("disabled");

      allQuestions.forEach((question) => question.input.clearError());

      let submittable = true;
      allQuestions.forEach((question) => {
        // Verify that the question is valid.
        if (!question.checkValidity()) {
          // Display the error
          // console.log("Found invalid question " + question.id);
          question.input.displayError("Invalid input");
          submittable = false;
        }
      });

      if(password !== passwordConfirm){
        registerErrorDiv.html("Passwords do not match")
          .addClass('shown')
        return
      }

      if (submittable) {
        if (password === passwordConfirm) {
          // console.log("Passwords match");
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
            registerErrorDiv.removeClass("shown");
          } else if(responseJson.name === "ConditionalCheckFailedException") {
            registerErrorDiv.html("Email already registered")
              .addClass("shown");
          } else {
            // Show error message
            registerErrorDiv.html(responseJson.message)
              .addClass("shown");
          }
        }
      } else {
        // console.log("Form is not submittable");
      }
    } catch (e) {
      console.log(`Caught exception during registration: ${e}`);
    } finally {
      pendingButton.removeClass("disabled");
    }

  });

  const $registerLink = $('#register-link');
  const $tabBar = $('tab-bar');
  const $registerButton = $('#registerButton');

// Listen for the click event on the "Click here to register" link
  $registerLink.on('click', function (event) {
    event.preventDefault(); // Prevent default anchor behavior

    // Find the Register tab using the panel-id
    const $registerTab = $tabBar.find('c-tab').filter(function () {
      return $(this).attr('panel-id') === 'scholarshipProviderRegistrationPanel';
    });

    if ($registerTab.length) {
      // Activate the Register tab via tabBar's API
      ($tabBar[0] as any).activeTab = $registerTab[0]; // Use the tab-bar's API to set active tab
    }
  });

  // Clear errors on click event
  $('form-question').on("click", function() {
    allQuestionsGlobal.forEach(question => question.input.clearError());
  })

// Listen for tab changes on the tab-bar
  $tabBar.on('change', function () {
    const activeTab = ($tabBar[0] as any).activeTab;

    if (activeTab) {
      const panelId = activeTab.panelId;
      // Clears error codes when tabs are switched
      if (panelId === 'scholarshipProviderLoginPanel') {
        // Clear login form error messages
        $('#divErrorLogin').removeClass('shown').html('');
        allQuestionsGlobal.forEach(question => question.input.clearError());
      } else if (panelId === 'scholarshipProviderRegistrationPanel') {
        // Clear registration form error messages
        $('#divErrorRegister').removeClass('shown').html('');
      }
    }
  });
})