// This script simply adds functionality to tab elements.
$(function () {
  // Set the currently selected tab to be active.
  const activeTab = document.querySelector('tab-bar').activeTab;
  $(`#${activeTab.panelId}`).attr('active', true);

  // Add an event listener to the tab-bar element to change the active tab.
  $('tab-bar').on('change', () => {
    const tabBar = document.querySelector('tab-bar');
    const panelId = tabBar.activeTab.panelId;

    // Hide all tab panels
    $('tab-panel').removeAttr('active');
    // Show the selected tab panel
    $(`#${panelId}`).attr('active', true);
  });
});