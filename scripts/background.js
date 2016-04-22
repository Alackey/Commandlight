//Listens for when Ctrl+Shift+L is pressed
chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.executeScript({
        file: "scripts/prompt.js"
    });
});

//Get command and url wanting to be added
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.url && request.command) {
            console.log("url: " + request.url + "\ncommand: " + request.command);
            sendResponse({"res": "Shortcut added successfully"});
        } else {
            sendResponse({"res": "URL and/or Command not found"});
        }
});
