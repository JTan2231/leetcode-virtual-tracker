browser.runtime.onMessage.addListener((message) => {
    if (message.action === "getCookie") {
        return browser.cookies.get({ url: message.url, name: message.name })
            .then(cookie => {
                return cookie;
            })
            .catch(error => {
                console.error("Error fetching cookie:", error);
                return null;
            });
    }
});

