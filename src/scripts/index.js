$(function () {
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
