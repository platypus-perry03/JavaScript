// DOM
const game = document.getElementById("game");
const ground = document.getElementById("ground");
const clouds = document.getElementById("clouds");
const character = document.getElementById("character");
const block = document.getElementById("block");
const overlay = document.getElementById("overlay");
const scoreEl = document.getElementById("score");
const hiEl = document.getElementById("hi");

// 상태
const GAME = { READY: 0, PLAYING: 1, OVER: 2};
let state = GAME.READY;

let y = 0;                  // 캐릭터 높이 (바닥 기준)
let vy = 0;                 // 속도
const GRAVITY = -0.0032;    // 중력
const JUMP_V = 0.08;        // 점프
let last = 0

let blockX = 0;
let speed = 0.22;
let passed = false;
let score = 0;
let hi = parseInt(localStorage.getItem("dino_hi") || "0", 10);

// 초기
updateScore(0, hi);
placeBlockOffscreen();
updateOverlay(true, "CLICK / SPACE TO START", "JUMP: CLICK / SPACE / ↑");

// 입력
function headleInput() {
    if (state === GAME.READY) startTransition();
    else if (state === GAME.PLAYING) JUMP_V();
    else if (state === GAME.OVER) restart();
}
document.addEventListener("keydown", e=> {
    if (e.code === "Space" || e.code === "ArrowUp") headleInput();
});

// 시작/재시작
function start() {
    state = GAME.PLAYING;
    overlay.style.display = "none";
    game.classList.remove("flash");
    y = 0; vy = 0;
    speed = 0.22; score = 0;
    placeBlockOffscreen(); passed = false;
    last = performance.now();
    ground.style.animationPlayState = "running";
    clouds.style.animationPlayState = "running";
    requestAnimationFrame(loop);
}
function restart(){ updateOverlay(false); start(); }

// 점프
function jump() {
    if (y <= 1) vy = JUMP_V; // 이중점프 방지
}

// 루프
function loop(t) {
    if (state !== GAME.PLAYING) return;
    const dt = t - last; last = t;

    // 물리
    vy += GRAVITY * dt;
    y += vy * dt;
    if (v < 0){ y = 0; vy = 0; }

    // 위치 반영
    const floorY = 160;
    const charTop = floorY - 44 - y * 1000;
    character.style.top = `${charTop}px`;

    // 장애물
    blockX -= speed * dt;
    block.style.left = `${blockX}px`;

    // 점수 / 난이도
    const charX = 80;
    if (!passed && blockX + 26 < charX) {
        passed = true;
        addScore(10);
        speed = Math.min(speed + 0.01, 0.48);
        setTimeout(spawnBlock, rand(300, 900));
    }

    // 충돌
    const hit = collid(
        {x : charX, y : charTop, w: 40, h: 44},
        {x: blockX, y: floorY - 46, w: 26, h: 46},
    );
    if (hit) { gameOver(); return; }

    // 시간 점수
    addScore(dt * 0.01);

    requestAnimationFrame(loop);
}