//Listens for when Ctrl+Shift+L is pressed
chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.executeScript({
        file: "scripts/prompt.js"
    });
});

//Get command and url wanting to be added
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        //Adding a command
        if (request.req == "add") {
            var url = request.url;
            var command = request.command;

            chrome.storage.sync.get("commands", function(data) {
                var commands = {};

                //If storage is empty create new commands array
                if (Object.keys(data).length === 0 &&
                JSON.stringify(data) === JSON.stringify({})) {

                    commands = [{"command": command, "url": url}];

                    //If is not empty add command to commands array
                } else{
                    data.commands.push({"command": command, "url": url});
                    commands = data.commands;

                }

                //Store command in chrome sync storage
                chrome.storage.sync.set({"commands": commands}, function() {
                    sendResponse({"res": "Shortcut added successfully"});
                });
            });

        //get the action of a single command to execute
        } else if (request.req == "execute"){
            var command = request.command;
            chrome.storage.sync.get("commands", function(data) {

                //If storage is empty create new commands array
                if (Object.keys(data).length === 0 &&
                JSON.stringify(data) === JSON.stringify({})) {

                    sendResponse({"res": "No commands exist"});

                    //If is not empty add command to commands array
                } else {
                    for (var action of data.commands) {
                        if (action.command == command) {
                            sendResponse({"res": action.url});
                        }
                    }

                    //Command does not exist
                    sendResponse({"res": "Command does not exist"});
                }
            });

        //get all commands/actions
        } else if (request.req == "getCommands") {
            chrome.storage.sync.get("commands", function(data) {
                sendResponse({"res": data.commands});
            });

        //Delete Command
        } else if (request.req == "delete") {

            chrome.storage.sync.get("commands", function(data) {
                var commands = removeCommand(data.commands, request.command);

                //Store command in chrome sync storage
                chrome.storage.sync.set({"commands": commands}, function() {
                    sendResponse({"res": "Removed Commands"});
                });
            });

        //Update command
        } else if (request.req == "update") {

            chrome.storage.sync.get("commands", function(data) {
                console.log(JSON.stringify(data.commands));
                var commands = data.commands;
                var index = getCommandIndex(commands, request.command_old);
                console.log(index);
                commands[index]["command"] = request.command;
                console.log("set command");
                commands[index]["action"] = request.action;
                console.log("set action");
                console.log(JSON.stringify(commands[index]));
                console.log(JSON.stringify(commands));
                //Store command in chrome sync storage
                chrome.storage.sync.set({"commands": commands}, function() {
                    console.log(JSON.stringify(commands));
                    sendResponse({"res": "Updated Command"});
                });
            });

        }
        return true;   //Tells chrome.runtime to continue to listen for response
    });

//Get command from commands array
//Return: index of command
function getCommandIndex(commands, cmdToFind) {
    for (var i = 0; i < commands.length / 2; i++) {
        if (commands[i].command == cmdToFind) {
            console.log("found index from start");
            return i;

        //For odd length of array
        } else if (i == (commands.length - 1 - i)) {
            console.log("odd length commands");
            return null;
        } else if (commands.length == 1) {
            console.log("length of commands = 1");
            return null;
        }

        if (commands[commands.length - 1 - i].command == cmdToFind) {
            console.log("found index from end");
            return commands.length - 1 - i;
        }
        console.log(commands[i]);
        console.log(commands[commands.length - 1 - i]);
        console.log(cmdToFind);
    }
    console.log("nothing found or caught");
}

//Remove command from commands
function removeCommand(commands, cmdToDelete) {

    for (var i = 0; i < commands.length / 2; i++) {
        if (commands[i].command == cmdToDelete) {
            commands.splice(i, 1);
            return commands;

        //For odd length of array
        } else if (i == (commands.length - 1 - i)) {
            return commands;
        } else if (commands.length == 1) {
            return commands;
        }

        if (commands[commands.length - 1 - i].command == cmdToDelete) {
            commands.splice(commands.length - 1 - i, 1);
            return commands;
        }

    }
}
