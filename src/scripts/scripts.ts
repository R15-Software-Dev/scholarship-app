import { TabBar } from "../customElements/Tabs";

$(function() {
  $("tab-bar").on("change", (event) => {
    const tabBar = document.querySelector("tab-bar") as TabBar;
    const activeTabIndex = tabBar.activeTabIndex;

    console.log(`Currently active tab: ${activeTabIndex}`);
  });
});
