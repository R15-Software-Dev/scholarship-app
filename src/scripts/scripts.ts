import { TabBar, Tab } from "../customElements/Tabs";

$(function() {
  // Show the correct first tab panel, based on what was marked as the
  // default active tab
  const activeTab = (document.querySelector("tab-bar") as TabBar).activeTab as Tab;
  console.log(`Attempting to show panel with id ${activeTab.panelId}`);
  $(`#${activeTab.panelId}`).show();
  

  $("tab-bar").on("change", () => {
    const tabBar = document.querySelector("tab-bar") as TabBar;
    const panelId = (tabBar.activeTab as Tab).panelId;

    // Hide all panels, then show the correct one.
    $(".tab-panel").hide();
    $(`#${panelId}`).show();
  });
});
