//Create command form
var form = document.createElement("form");
var input = document.createElement("input");

form.setAttribute("id", "commandlight_form");
form.style.zIndex = "2147483638";

input.setAttribute("type", "text");
input.setAttribute("placeholder", "Enter command...");
input.setAttribute("id", "commandlight_prompt");
input.setAttribute("name", "commandlight_prompt");
input.setAttribute("autofocus", "autofocus");
input.style.position = "absolute";
input.style.width = "80%";
input.style.top = "30%";
input.style.right = "10%";
input.style.backgroundColor = "gray";
input.style.color = "white";
input.style.fontSize = "3em";
input.style.padding = "2px 2px 2px 2px";
input.style.border = "0";
input.style.borderRadius = "3px";

form.appendChild(input);

//Add form to page
var body = document.getElementsByTagName('body')[0];
body.appendChild(form);

//Add onsubmit listener
document.getElementById("commandlight_form").addEventListener("submit", function(event){
    //Get command
    var command = document.getElementById("commandlight_prompt").value;
    alert(command);

    //Remove prompt display
    var form = document.getElementById("commandlight_form");
    form.parentNode.removeChild(form);

    event.preventDefault();
});
