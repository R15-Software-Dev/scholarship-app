import {Tab, TabBar} from "../customElements/Tabs";
$(function(){
  const tabBar = document.querySelector("tab-bar") as TabBar;
  const activeTab = tabBar.activeTab;
  // Set checked to false initially
  activeTab.checked = false;
  $("form-section").on("submit-complete", (event) => {
    // Adds checkmark to tab upon successful submission
    activeTab.checked = true;
    // Moves to next tab
    tabBar.nextTab();
  });
})