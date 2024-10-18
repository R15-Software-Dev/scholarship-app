$(function () {
  // Show the correct first tab panel, based on what was marked as the
  // default active tab
  const activeTab = document.querySelector("tab-bar").activeTab;
  $(`#${activeTab.panelId}`).attr("active", true);

  $("tab-bar").on("change", () => {
    const tabBar = document.querySelector("tab-bar");
    const panelId = tabBar.activeTab.panelId;

    // Hide all panels, then show the correct one.
    $("tab-panel").removeAttr("active");
    $(`#${panelId}`).attr("active", true);
  });

  $("#listButton").on("click", async () => {
    // Send a request to the API and get all user information.
    // This uses what will eventually be a quite expensive (literally) scan operation.
    const response = await fetch(
      "https://qngitit3sb.execute-api.us-east-1.amazonaws.com/demo/getAllUsers",
      {
        method: "POST",
        body: "",
      },
    );

    const body = await response.json();
    const contentDiv = document.querySelector("#scanContent");

    body.Items.forEach((item) => {
      const appendString = `${item.emailAddress.S}, ${item.lastName.S}, ${item.firstName.S}`;
      contentDiv.innerHTML += `<p>${appendString}</p>`;
    });
  });
});
