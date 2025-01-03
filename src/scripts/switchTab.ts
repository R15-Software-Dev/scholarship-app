import {Tab, TabBar} from "../customElements/Tabs";
$(function(){
  $("form-section").on("submit-complete", (event) => {
    const tabBar = document.querySelector("tab-bar") as TabBar;
    tabBar.nextTab();
  });
})