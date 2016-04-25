//On Load
displayCommands();

//Clicking the "+ Add" button
document.getElementById("addCommandBtn").addEventListener("click", function(event){
    var form = document.createElement("form");
    var input_cmd = document.createElement("input");
    var input_url = document.createElement("input");
    var submit = document.createElement("input");

    form.setAttribute("id", "cmd_form");

    input_cmd.setAttribute("type", "text");
    input_cmd.setAttribute("placeholder", "Command");
    input_cmd.setAttribute("id", "input_cmd");
    input_cmd.setAttribute("name", "input_cmd");
    input_cmd.setAttribute("autofocus", "autofocus");
    input_cmd.style.width = "25%";
    input_cmd.style.marginRight = "5px";
    input_cmd.style.borderRadius = "4px";
    input_cmd.style.borderTop = "0";
    input_cmd.style.borderRight = "0";
    input_cmd.style.borderLeft = "0";
    input_cmd.style.fontSize = "1.2em";

    input_url.setAttribute("type", "text");
    input_url.setAttribute("placeholder", "URL");
    input_url.setAttribute("id", "input_url");
    input_url.setAttribute("name", "input_url");
    input_url.style.width = "65%";
    input_url.style.borderRadius = "4px";
    input_url.style.borderTop = "0";
    input_url.style.borderRight = "0";
    input_url.style.borderLeft = "0";
    input_url.style.fontSize = "1.2em";

    submit.setAttribute("type", "submit");
    submit.setAttribute("id", "input_submit");
    submit.setAttribute("value", "Add");
    submit.style.padding = "1px 3px 1px 3px";
    submit.style.border = "0";
    submit.style.marginLeft = "1px";
    submit.style.fontSize = "1.2em";

    //Add inputs to form
    form.appendChild(input_cmd);
    form.appendChild(input_url);
    form.appendChild(submit);

    //Add form to popup
    var command_form = document.getElementById("addCommandForm");
    command_form.appendChild(form);

    //Add command onsubmit listener
    document.getElementById("cmd_form").addEventListener("submit",
    function(event){

        //Get command
        var command = document.getElementById("input_cmd").value;
        var url = document.getElementById("input_url").value;
        url = url.match(/^http[s]*:\/\//) ? url : 'http://' + url;  //Add http

        //Send command background.js to be saved
        chrome.runtime.sendMessage({"command": command, "url": url},
        function(response) {
            console.log(response.res);

            if (response.res == "Shortcut added successfully") {

                //Display new command in opened popup
                var tableRow = document.createElement("tr");
                command_ele = document.createElement("td");
                var action_ele = document.createElement("td");
                var delete_icon = document.createElement("img");

                //tablerow element
                var id = document.getElementById("commands").lastChild.id;
                id = "row" + (parseInt(id.split("w")[1]) + 1);
                tableRow.setAttribute("id", id);

                //Command and action elements
                command_ele.innerHTML = command;
                command_ele.style.width = "30%";
                action_ele.innerHTML = url;
                action_ele.style.width = "70%";

                //create delete element
                delete_icon.setAttribute("class", "deleteIcon");
                delete_icon.setAttribute("src", "../img/Delete-24.png");

                //Add commands, action, delete_icon to tableRow
                tableRow.appendChild(command_ele);
                tableRow.appendChild(action_ele);
                tableRow.appendChild(delete_icon);

                //Add tableRow to table
                document.getElementById("commands").appendChild(tableRow);
            }
        });

        //Remove cmd_form
        var form = document.getElementById("cmd_form");
        form.parentNode.removeChild(form);

        event.preventDefault();
    });
});

//Display all commands in the popup
function displayCommands () {
    chrome.runtime.sendMessage({"req": "getCommands"},
    function(response) {
        var commands = response.res;

        if (commands.length === 0) {
            document.getElementsByTagName("h3").textContent = "No Commands"
        } else {
            var table  = document.getElementById("commands");
            var tableRow = document.createElement("tr");
            var delete_icon = document.createElement("img");

            //create delete element
            delete_icon.setAttribute("class", "deleteIcon");
            delete_icon.setAttribute("src", "../img/Delete-24.png");

            //Add Table headers
            var th_command = document.createElement("th");
            var th_url = document.createElement("th");
            th_command.innerHTML = "Command";
            th_url.innerHTML = "Link";

            tableRow.appendChild(th_command);
            tableRow.appendChild(th_url);
            table.appendChild(tableRow);

            //Display Commands
            var i = 0;
            for (var action of commands) {
                tableRow = document.createElement("tr");
                var command = document.createElement("td");
                var url = document.createElement("td");

                tableRow.setAttribute("id", "row" + i);

                command.style.width = "30%";
                url.style.width = "70%";

                command.innerHTML = action.command;
                url.innerHTML = action.url;

                tableRow.appendChild(command);
                tableRow.appendChild(url);
                tableRow.appendChild(delete_icon.cloneNode());
                table.appendChild(tableRow);

                ++i;
            }

            //Add event listener for delete
            var all_delete_icons = document.getElementsByClassName("deleteIcon");
            for(var i = 0; i < all_delete_icons.length; i++) {
                all_delete_icons.item(i).addEventListener("click", function(data) {
                    document.getElementById("tempID")
                        .setAttribute("id", this.parentElement.id);

                    //Get and add command and action to conirmation window
                    document.getElementById("confirm_action").innerHTML =
                        this.previousSibling.innerHTML;
                    document.getElementById("confirm_cmd").innerHTML =
                        this.previousSibling.previousSibling.innerHTML;

                    document.getElementById("confirmationWindow").style.display = "inline";

                });
            }
        }
    });
}
