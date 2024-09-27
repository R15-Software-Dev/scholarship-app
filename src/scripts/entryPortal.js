$(function () {
  const activeTab = document.querySelector("tab-bar").activeTab;
  $(`#${activeTab.panelId}`).show();

  $("tab-bar").on("change", () => {
    const tabBar = document.querySelector("tab-bar");
    const panelId = tabBar.activeTab.panelId;

    // Hide all panels, then show the correct one.
    $(".tab-panel").hide();
    $(`#${panelId}`).show();
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
});
