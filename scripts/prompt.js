//Create command form
var form = document.createElement("form");
var input = document.createElement("input");
var style = document.createElement("style");

form.setAttribute("id", "commandlight_form");

input.setAttribute("type", "text");
input.setAttribute("placeholder", "Enter command...");
input.setAttribute("id", "commandlight_prompt");
input.setAttribute("name", "commandlight_prompt");
input.setAttribute("autofocus", "autofocus");
input.style.position = "fixed";
input.style.width = "80%";
input.style.top = "30%";
input.style.right = "10%";
input.style.backgroundColor = "#525252";
input.style.color = "white";
input.style.fontSize = "3em";
input.style.padding = "5px 5px 5px 8px";
input.style.border = "0";
input.style.borderRadius = "3px";
input.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.6), 0 4px 20px 4px rgba(0, 0, 0, 0.6)";
input.style.zIndex = "2147483638";

form.appendChild(input);

var css = document.createTextNode("\
    #commandlight_prompt::-webkit-input-placeholder { /* WebKit, Blink, Edge */ \
        color: white;                                                           \
    }                                                                           \
    #commandlight_prompt:-moz-placeholder { /* Mozilla Firefox 4 to 18 */       \
       color: white;                                                            \
       opacity: 1;                                                              \
    }                                                                           \
    #commandlight_prompt::-moz-placeholder { /* Mozilla Firefox 19+ */          \
       color: white;                                                            \
       opacity: 1;                                                              \
    }                                                                           \
    #commandlight_prompt:-ms-input-placeholder { /* Internet Explorer 10-11 */  \
       color: white;                                                            \
    }                                                                           \
    #commandlight_prompt {                                                      \
        opacity:0;                                                              \
        -webkit-transition: opacity .1s;                                         \
        -moz-transition: opacity .1s;                                            \
        -o-transition: opacity .1s;                                              \
        transition: opacity .1s;                                                 \
    }\
");
style.appendChild(css);
style.setAttribute("id", "commandlight_css");

//Add form to page
var body = document.getElementsByTagName('body')[0];
body.appendChild(style);
body.appendChild(form);
document.getElementById("commandlight_prompt").focus();
document.getElementById("commandlight_prompt").style.opacity = 1;

//Add onsubmit listener
document.getElementById("commandlight_form").addEventListener("submit", function(event){
    //Get command
    var command = document.getElementById("commandlight_prompt").value;

    chrome.runtime.sendMessage({"req": "execute", "command": command},
        function(response) {
            var url = response.res;
            console.log("Url for command: " + url);

            //Remove prompt display
            var form = document.getElementById("commandlight_form");
            form.parentNode.removeChild(form);

            //Remove style html
            var style = document.getElementById("commandlight_css");
            style.parentNode.removeChild(style);

            //Open tab
            window.open(url, '_blank');

    });

    event.preventDefault();
});
