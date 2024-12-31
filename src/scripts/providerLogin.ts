import { FormQuestion } from "../customElements/Forms";

$(function() {
  const apiBase = "http://localhost:3000";

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
      loginErrorDiv.removeClass("shown");

      const response = await fetch(apiBase + "/providers/login", {
        method: "POST",
        body: JSON.stringify(values)
      });

      const responseJson = await response.json();

      if (responseJson.message === "Login successful") {
        // Redirect to the entryPortal page.
        window.location.replace("./entryPortal.html");
      } else {
        loginErrorDiv.html(responseJson.message).addClass("shown");
      }
    } catch (e) {
      console.log("Caught statement");
    } finally {
      pendingButton.removeClass("disabled");
    }
  });

  $("#registration-form").on("submit", async (event) => {
    event.preventDefault();

    const emailInput = this.querySelector("#registerEmailInput") as FormQuestion;
    const passwordInputOne = this.querySelector("#registerPasswordInput") as FormQuestion;
    const passwordInputTwo = this.querySelector("#registerConfirmPasswordInput") as FormQuestion;

    const email = emailInput.input.getValue();
    const password = passwordInputOne.input.getValue();
    const passwordConfirm = passwordInputTwo.input.getValue();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const mismatchedPasswords = $('#mismatchedPasswords');
    const registerErrorDiv = $('#divErrorRegister');
    const pendingButton = $('#registerButton');

    try {
      // Clear errors
      mismatchedPasswords.removeClass("shown");
      registerErrorDiv.removeClass("shown");

      pendingButton.addClass("disabled");

      // Validating user input
      // Test for empty fields
      if (!password || !passwordConfirm || !email){
        registerErrorDiv.html("Fields cannot be empty").addClass("shown");
        return; //Exit if fields are filled out
        // Email validation
      } else if (!emailRegex.test(email)){
        registerErrorDiv.html("Invalid email format").addClass("shown");
        return;
        // Password validation
      } else if (password !== passwordConfirm) {
        registerErrorDiv.html("Passwords do not match").addClass("shown");
        return; // Exit if passwords match
      }

      const response = await fetch(apiBase + "/providers/registration",{
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      const responseJson = await response.json();

      // Handle API response
      if (responseJson.message === "Registration successful") {
        window.location.replace("./entryPortal.html");
      } else {
        // Show error message
        registerErrorDiv.html(responseJson.message).addClass("shown");
      }
    } catch (e) {
      console.error("Caught exception during registration:", e);
    } finally {
      pendingButton.removeClass("disabled");
    }
  });

  const $registerLink = $('#register-link');
  const $tabBar = $('tab-bar');

  // Switch between Sign-in and Register tabs
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

  // Clear error codes when tabs are switched
  $tabBar.on('change', function () {
    const activeTab = ($tabBar[0] as any).activeTab;

    if (activeTab) {
      const panelId = activeTab.panelId;
      if (panelId === 'scholarshipProviderLoginPanel') {
        // Clear login form error messages
        $('#divErrorLogin').removeClass('shown').html('');
      } else if (panelId === 'scholarshipProviderRegistrationPanel') {
        // Clear registration form error messages
        $('#divErrorRegister').removeClass('shown').html('');
        $('#mismatchedPasswords').removeClass('shown').html('');
      }
    }
  });
})

