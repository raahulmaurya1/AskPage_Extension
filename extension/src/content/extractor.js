chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "EXTRACT_PAGE") {
    console.log("EXTRACT_PAGE received in content script");

    // Extract clean readable text
    const cleanText = document.body.innerText
      .replace(/\s\s+/g, " ")
      .trim();

    sendResponse({
      text: cleanText,
      url: window.location.href,
    });

    // 🔴 REQUIRED: keeps the response channel open
    return true;
  }
});