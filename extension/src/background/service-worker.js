chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "EXTRACT_PAGE") {
    const text = document.body.innerText;
    sendResponse({
      url: location.href,
      text,
    });
  }
});
    