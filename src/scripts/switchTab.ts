import {Tab, TabBar} from "../customElements/Tabs";
$(function(){
  $("form-section").on("submit-complete", (event) => {
    const tabBar = document.querySelector("tab-bar") as TabBar;
    const activeTab = tabBar.activeTab;
    // Adds checkmark to tab upon successful submission
    activeTab.checked = true;
    // Moves to next tab
    tabBar.nextTab();
  });
})