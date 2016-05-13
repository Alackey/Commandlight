//Check if on manage.html
var on_managePage = false;
if (document.title.split("-")[1] == " Manage") {
    on_managePage = true;
}

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
        chrome.runtime.sendMessage({"req": "add", "command": command, "url": url},
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

            //Edit button if on manage page
            if (on_managePage) {
                var td_edit_icon = document.createElement("td");
                var edit_icon = document.createElement("img");

                edit_icon.setAttribute("class", "editIcon");
                edit_icon.setAttribute("src", "../img/Pencil-24.png");

                td_edit_icon.appendChild(edit_icon);

            }

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

                //Edit icon
                if (on_managePage) {
                    tableRow.appendChild(td_edit_icon.cloneNode(true));
                }

                tableRow.appendChild(delete_icon.cloneNode());
                table.appendChild(tableRow);

                ++i;
            }

            //All edit buttons
            if (on_managePage) {
                var all_edit_icons = document.getElementsByClassName("editIcon");
            }

            //All delete buttons
            var all_delete_icons = document.getElementsByClassName("deleteIcon");

            //Event listeners for delete, edit
            for(var i = 0; i < all_delete_icons.length; i++) {

                //Add event listener for delete buttons
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

                //Add event listener for edit buttons
                if (on_managePage) {
                    all_edit_icons.item(i).addEventListener("click", function(data) {
                        var command_field = this.parentNode.previousSibling
                                            .previousSibling;
                        var action_field = this.parentNode.previousSibling;

                        var tr_id = command_field.parentNode.id;
                        var edit_cmd_id = tr_id + "_edit_cmd";
                        var edit_action_id = tr_id + "_edit_action";

                        var td = document.createElement("td");
                        var input = document.createElement("input");

                        //Command input
                        var command_edit = td.cloneNode();
                        command_edit.style.width = "30%";

                        var input_edit_cmd = input.cloneNode();
                        input_edit_cmd.setAttribute("type", "text");
                        input_edit_cmd.setAttribute("id", edit_cmd_id);
                        input_edit_cmd.setAttribute("name", edit_cmd_id);
                        input_edit_cmd.setAttribute("form", "form_edit");
                        input_edit_cmd.value = command_field.innerHTML;
                        input_edit_cmd.style.width = "100%";

                        command_edit.appendChild(input_edit_cmd);

                        //Action input
                        var action_edit = td.cloneNode();
                        action_edit.style.width = "70%";

                        var input_edit_action = input.cloneNode();
                        input_edit_action.setAttribute("type", "text");
                        input_edit_action.setAttribute("id", edit_action_id);
                        input_edit_action.setAttribute("name", edit_action_id);
                        input_edit_action.setAttribute("form", "form_edit");
                        input_edit_action.value = action_field.innerHTML;
                        input_edit_action.style.width = "100%";

                        action_edit.appendChild(input_edit_action);

                        //Display input
                        command_field.parentNode.insertBefore(command_edit,
                                                              command_field);
                        command_field.parentNode.insertBefore(action_edit,
                                                              command_field);

                        //Hide old fields
                        command_field.style.display = "none";
                        action_field.style.display = "none";


                    });
                }
            }

            //Submit listener for edit
            document.getElementById("form_edit").addEventListener("submit",
            function(event) {
                var form_elements = document.getElementById("form_edit").elements;
                var cmd_edit_value = form_elements[1].value;
                var action_edit_value = form_elements[2].value;
                var cmd_edit_td = form_elements[1].parentNode;
                var action_edit_td = form_elements[2].parentNode;
                var cmd_ele = action_edit_td.nextSibling;
                var action_ele = action_edit_td.nextSibling.nextSibling;

                //Remove edit inputs
                cmd_edit_td.parentNode.removeChild(cmd_edit_td);
                action_edit_td.parentNode.removeChild(action_edit_td);

                //Display cmd and action td's
                cmd_ele.style.display = "table-cell";
                action_ele.style.display = "table-cell";

                //Check if it was changed


                chrome.runtime.sendMessage(
                    {
                        "req": "update",
                        "command_old": cmd_ele.innerHTML,
                        "command": cmd_edit_value,
                        "action": action_edit_value
                    },
                    function(response) {
                        console.log(response.res);
                });

                event.preventDefault();
            });
        }
    });
}
