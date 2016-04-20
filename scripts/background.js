//Listens for when Ctrl+Shift+L is pressed
chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.executeScript({
        file: "scripts/prompt.js"
    });
});
