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
            var url = request.url;
            var command = request.command;

            chrome.storage.sync.get("commands", function(data) {
                var commands = {};
                console.log(JSON.stringify(data));
                //If storage is empty create new commands array
                if (Object.keys(data).length === 0 &&
                    JSON.stringify(data) === JSON.stringify({})) {
                    console.log("Not commands");
                    commands = [{"command": command, "url": url}];

                //If is not empty add command to commands array
                } else{
                    console.log("Adding commands to list");
                    data.commands.push({"command": command, "url": url});
                    commands = data.commands;

                }

                //Store command in chrome sync storage
                chrome.storage.sync.set({"commands": commands}, function() {
                    sendResponse({"res": "Shortcut added successfully"});
                });
            });

        } else {
            sendResponse({"res": "URL and/or Command not found"});
        }
    });
