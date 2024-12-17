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

  // Function scrolls to the top of the page when you click a tab
  // Get the button element
  const scrollToTopButton = document.querySelector('tab-bar');

  // Add a click event listener to the button
  scrollToTopButton.addEventListener("click", () => {
    // Scroll to the top of the page with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
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
