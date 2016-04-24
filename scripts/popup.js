
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
            console.log(command + " " + url);

            chrome.runtime.sendMessage({"command": command, "url": url},
                function(response) {
                    console.log(response.res);
            });

            //Remove cmd_form
            var form = document.getElementById("cmd_form");
            form.parentNode.removeChild(form);

            event.preventDefault();
    });
});

function displayCommands () {
    chrome.runtime.sendMessage({"action": "getCommands"},
        function(response) {
            console.log("response: " + JSON.stringify(response.res[0]));
            var commands = response.res;

            if (commands.length === 0) {
                document.getElementsByTagName("h3").textContent = "No Commands"
            } else {
                var table  = document.getElementById("commands");
                var tableRow = document.createElement("tr");

                //Add Table headers
                var th_command = document.createElement("th");
                var th_url = document.createElement("th");
                th_command.innerHTML = "Command";
                th_url.innerHTML = "Link";

                tableRow.appendChild(th_command);
                tableRow.appendChild(th_url);
                table.appendChild(tableRow);

                //Display Commands
                for (var action of commands) {
                    console.log(action.url + " : " + action.command);
                    tableRow = document.createElement("tr");
                    var command = document.createElement("td");
                    var url = document.createElement("td");

                    command.style.width = "30%";
                    url.style.width = "70%";

                    command.innerHTML = action.command;
                    url.innerHTML = action.url;

                    tableRow.appendChild(command);
                    tableRow.appendChild(url);

                    table.appendChild(tableRow);
                }
            }
    });
}
