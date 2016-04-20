var body = document.getElementsByTagName('body')[0];
var form = document.createElement("form");
var input = document.createElement("input");

form.setAttribute("method", "get");

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

form.appendChild(input);

body.appendChild(form);
