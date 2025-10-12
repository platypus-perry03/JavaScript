var charater = document.getElementById("character");
var block = document.getElementById("block");

function jump() {
    if(CharacterData.classList != "animate") {
        charater. classList.add("animate");
    }
    setTimeout(function() {
        CharacterData.classList.remove("animate");
    }, 500);
}