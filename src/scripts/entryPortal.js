$(function () {
  const activeTab = document.querySelector("tab-bar").activeTab;
  $(`#${activeTab.panelId}`).show();

  $("tab-bar").on("change", () => {
    const tabBar = docment.querySelector("tab-bar");
    const panelId = tabBar.activeTab.panelId;

    // Hide all panels, then show the correct one.
    $(".tab-panel").hide();
    $(`#${panelId}`).show();
  });

  // Listen for change event on email input
  $("sclshpConfirmEmailInput").on("focuslost", function () {
    const email = this.value;
    const compEmail = $("sclshpContactEmailInput").value;

    if (email !== compEmail) {
      $("sclshpContactEmailInput").showError("Emails do not match.");
      this.showError("Emails do not match.");
    } else {
      // Clear errors.
      $("sclshpContactEmailInput").hideErrors();
      this.hideErrors();
    }
  });
});
