import {OutlinedTextField} from "../customElements/TextField";
import {Scholarship} from "../lambdaFunctions/types/scholarship";
import {Checkbox} from "../customElements/Checkbox";
import {Dropdown} from "../customElements/Dropdown";
import {InputElement} from "../customElements/InputElement";

$(async function () {
  const apiBase = "http://localhost:3000";
  // Initialize the forms
  // First get the information from the database
  const response = await fetch(apiBase + "/providers/info/all", { method: "get" });
  const scholarship = await response.json() as Scholarship;
 
  // Use the information on each input.
  // We'll use the response JSON's entry names as selectors.
  Object.entries(scholarship).forEach(([key, value]) => {
    // Update the corresponding input element with the value
    let input: InputElement = document.querySelector(`#${key}Input`);
    input.setValue(value);
  });
  
  
  // Listen for change event on email input
  $("#sclshpConfirmEmailInput").on("focusout", function () {
    console.log("Checking emails");
    const emailInput = document.querySelector(
      "#sclshpContactEmailInput",
    )._input;
    const compEmailInput = document.querySelector(
      "#sclshpConfirmEmailInput",
    )._input;

    if (emailInput.value !== compEmailInput.value) {
      console.log("Emails do not match, showing error.");
      compEmailInput.showErrorString("Emails do not match.");
    } else {
      // Clear errors.
      compEmailInput.hideErrors();
    }
  });

  // Function scrolls to the top of the page when a tab is clicked
  $('tab-bar').on('click', function () {
    // Scroll to the top of the page smoothly
    $('html, body').animate({ scrollTop: 0 }, 'smooth');
  });

  $("#essayRequirementOption").on("change", function () {
    const essaySelection = $("#essayRequirementSelection");
    if (this.selectedCheckbox[0] === "Yes") {
      // Show the box
      essaySelection.css("display","block");
    } else {
      // Don't show a box
      essaySelection.css("display","none");
    }
  })
});
