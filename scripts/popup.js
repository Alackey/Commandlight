
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

    input_url.setAttribute("type", "text");
    input_url.setAttribute("placeholder", "URL");
    input_url.setAttribute("id", "input_url");
    input_url.setAttribute("name", "input_url");
    input_url.style.width = "65%";
    input_url.style.borderRadius = "4px";
    input_url.style.borderTop = "0";
    input_url.style.borderRight = "0";
    input_url.style.borderLeft = "0";

    submit.setAttribute("type", "submit");
    submit.setAttribute("id", "input_submit");
    submit.setAttribute("value", "Add");
    submit.style.padding = "1px 3px 1px 3px";
    submit.style.border = "0";
    submit.style.marginLeft = "1px";

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
