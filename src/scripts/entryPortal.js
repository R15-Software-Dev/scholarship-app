$(function () {
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
