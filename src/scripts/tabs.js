// This script simply adds functionality to tab elements.
$(function () {
  const activeTab = document.querySelector('tab-bar').activeTab;
  $(`#${activeTab.panelId}`).attr('active', true);

  $('tab-bar').on('change', () => {
    const tabBar = document.querySelector('tab-bar');
    const panelId = tabBar.activeTab.panelId;

    $('tab-panel').removeAttr('active');
    $(`#${panelId}`).attr('active', true);
  });
});
