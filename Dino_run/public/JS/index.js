var charater = document.getElementById("character");
var block = document.getElementById("block");

function jump() {
    charater. classList.add("animate");
    setTimeout(function() {
        
        CharacterData.classList.remove("animate");
    }, 500);
}