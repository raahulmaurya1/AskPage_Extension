chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel) {
    chrome.sidePanel.setOptions({
      enabled: true,
      path: "sidepanel.html"
    });
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!chrome.sidePanel) {
    console.error("Side Panel API not available in this Chrome version");
    return;
  }

  await chrome.sidePanel.open({
    tabId: tab.id
  });
});
