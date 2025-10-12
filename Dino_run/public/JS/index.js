// 핵심 수정: 변수명/오탈자/연산자/클래스 비교 방식
const character = document.getElementById("character");
const block = document.getElementById("block");

function jump() {
  // 이미 점프 중이면 중복 실행 방지
  if (!character.classList.contains("animate")) {
    character.classList.add("animate");
    setTimeout(() => {
      character.classList.remove("animate");
    }, 500); // CSS jump 0.5s와 동일
  }
}

// 주기적으로 충돌 체크
const checkDead = setInterval(function () {
  const characterTop = parseInt(
    window.getComputedStyle(character).getPropertyValue("top"),
    10
  );
  const blockLeft = parseInt(
    window.getComputedStyle(block).getPropertyValue("left"),
    10
  );

  // 블록이 캐릭터 x범위(0~70px 근처) 들어오고, 캐릭터가 충분히 낮으면 충돌
  // (캐릭터 left: 50px, block이 왼쪽에서 0~70 사이로 들어오면 접촉 가능)
  if (blockLeft < 70 && blockLeft > 30 && characterTop >= 130) {
    block.style.animation = "none";
    block.style.display = "none";
    alert("U lose.");
  }
}, 10);

// 키보드(스페이스/화살표↑)로도 점프 가능하게
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") jump();
});
