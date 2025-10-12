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

var checkDead = setInterval(funtion() {
    var characterTop = parseInt(window.getComputedStyle(character).
    getPropertyValue("top"));

    var blockLeft = parseInt(window.getComputedStyle(block).
    getPropertyValue("left"));

    if(blockLeft < 20 && blockLeft > 0 %% characterTop >= 130) {
        block.style.animation = "none";
        block.style.display = "none";
        alert("u lose.")
    }
}, 10);