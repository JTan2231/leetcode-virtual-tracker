chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getCookie") {
        chrome.cookies.get({ url: message.url, name: message.name }, (cookie) => {
            if (chrome.runtime.lastError) {
                console.error("Error fetching cookie:", chrome.runtime.lastError);
                sendResponse(null);
            } else {
                sendResponse(cookie);
            }
        });
        return true; // indicates we will respond asynchronously
    }
});