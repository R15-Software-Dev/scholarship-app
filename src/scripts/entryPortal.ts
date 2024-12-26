import {Scholarship} from "../lambdaFunctions/types/scholarship";
import {InputElement} from "../customElements/InputElement";
import {Checkbox} from "../customElements/Checkbox";

$(async function () {
  // Handles showing the essay selections when the option to pick them is shown.
  document.querySelector("#essayRequirementOption").addEventListener("change", function () {
    const essaySelection = $("#essayRequirementSelection");
    if (this.selectedCheckbox[0] === "Yes") {
      // Show the box
      essaySelection.css("display","block");
    } else {
      // Don't show a box
      essaySelection.css("display","none");
    }
  });

  //#region Form Initialization
  // const apiBase = "http://localhost:3000";
  // Initialize the forms
  // First get the information from the database
  const response = await fetch("/providers/info/all", { method: "get" });
  const scholarship = await response.json() as Scholarship;
 
  // Use the information on each input.
  // We'll use the response JSON's entry names as selectors.
  Object.entries(scholarship).forEach(([key, value]) => {
    // Update the corresponding input element with the value
    if (value !== null) {
      let input: InputElement = document.querySelector(`#${key}Input`);
      // Check the type of the value
      if (typeof value === "object") {
        // This should be iterated over (we can only receive string[] as an object)
        value = value as string[];
        value.forEach((item) => {
          (input as Checkbox).checkValue(item);
        })
      } else {
        // We can set the value normally
        input.value = value;
      }
    }
  });
  //#endregion

  // Function scrolls to the top of the page when a tab is clicked
  $('tab-bar').on('click', function () {
    // Scroll to the top of the page smoothly
    $('html, body').animate({ scrollTop: 0 }, 'smooth');
  });
});
