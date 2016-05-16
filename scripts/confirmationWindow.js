//Clicking cancel on confirmation delete page
document.getElementById("confirm_cancel").addEventListener("click", function() {
    document.getElementById("confirmationWindow").style.display = "none";

    var tempIDNode = document.getElementById("confirm_q").nextSibling.nextSibling;
    tempIDNode.id = "tempID";
});

//Clicking delete on confirmation delete page
document.getElementById("confirm_delete").addEventListener("click", function() {
    var cmd = document.getElementById("confirm_cmd").innerHTML;
    console.log(cmd);
    chrome.runtime.sendMessage({"req": "delete", "command": cmd},
    function(response){

        var tempIDNode = document.getElementById("confirm_q").nextSibling.nextSibling;
        
        var row_id = tempIDNode.id;
        tempIDNode.id = "tempID";
        var row_ele = document.getElementById(row_id);
        row_ele.parentNode.removeChild(row_ele);

        document.getElementById("confirmationWindow").style.display = "none";
    });

});