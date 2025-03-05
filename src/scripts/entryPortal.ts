import {Scholarship} from "../lambdaFunctions/types/scholarship";
import {InputElement} from "../customElements/InputElement";
import {Checkbox} from "../customElements/Checkbox";
import {FormQuestion} from "../customElements/Forms";

$(async function () {
  // Redirect to closedForm.html
  window.location.replace("closedForm.html");

  // Handles showing the essay selections when the option to pick them is shown.
  document.querySelector("#essayRequirementInput").addEventListener("change", function () {
    const essayQuestion = $("#essaySelectionQuestion");
    const customEssayQuestion = $("#customEssayPromptQuestion");
    if (this.selectedCheckbox[0] === "Yes") {
      // Show the questions
      essayQuestion.css("display", "block");
      customEssayQuestion.css("display", "block");
    } else {
      // Ensure the questions are hidden
      essayQuestion.css("display", "none");
      customEssayQuestion.css("display", "none");
    }
  });

  //#region Eligibility Factors Tab

  document.querySelector("#studyRequirementInput").addEventListener("change", function () {
    // Control the studyAreaInput.
    const areaInput = document.querySelector("#requiredStudyAreaQuestion") as FormQuestion;
    if (this.selectedCheckbox[0] === "Yes") {
      areaInput.input.required = true;
      areaInput.style.display = "block";
    } else {
      areaInput.input.required = false;
      areaInput.style.display = "none";
    }
  });

  document.querySelector("#studentResidenceInput").addEventListener("change", function () {
    // Control the residenceAreaInput.
    const areaInput = document.querySelector("#requiredResidenceAreaQuestion") as FormQuestion;
    if (this.selectedCheckbox[0] === "Yes") {
      areaInput.input.required = true;
      areaInput.style.display = "block";
    } else {
      areaInput.input.required = false;
      areaInput.style.display = "none";
    }
  });

  //#endregion

  //#region Form Initialization
  // const apiBase = "http://localhost:3000";
  // Initialize the forms
  // Show loader
  const loader = $(".loader");
  loader.show();
  // First get the information from the database
  const response = fetch("/providers/info/all", { method: "get" })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        if (response.status === 401) {
          // If unauthorized, return user to the login page.
          window.location.href = "/providerLogin.html";
        }
        throw new Error(`HTTP Error ${response.status} - ${response.statusText}`);
      }
    })
    .then(data => {
      console.log("Got information successfully");
      const scholarship = data as Scholarship;

      // Use the information on each input.
      // We'll use the response JSON's entry names as selectors.
      Object.entries(scholarship).forEach(([key, value]) => {
        // Update the corresponding input element with the value
        if (value !== null) {
          let input: InputElement = document.querySelector(`#${key}Input`);
          console.log(`Setting value of input ${key}Input`);
          // Check the type of the value
          if (typeof value === "object") {
            // This should be iterated over (we can only receive string[] as an object)
            console.log("Found string[] value");
            // TODO Find a better way of doing this, along with the API definitions.
            //@ts-ignore
            value = value as string[];
            //@ts-ignore
            value.forEach((item) => {
              (input as Checkbox).checkValue(item);
            })
          } else {
            // TODO Again find a better way of doing this.
            // We can set the value normally
            input.value = value;
          }
        }
      });
      // Fade out the loader
      loader.fadeOut("fast");
    })
    .catch(error => {
      console.log(`Error fetching: ${error}`);
      loader.html(`<div><p>${error.message}</p><p>Please try again later, or send a bug report to <a href="mailto:developers@region15.org">developers@region15.org</a></p></div>`);
    })
    .finally(() => {
      console.log("Finished loading.");
    });

  // const scholarship = await response.json() as Scholarship;


  //#endregion

});
