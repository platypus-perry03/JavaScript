// ========== Dino Run (px/s 기반 물리) ==========

// === DOM 요소 참조 ===
const game = document.getElementById("game");
const ground = document.getElementById("ground");
const clouds = document.getElementById("clouds");
const character = document.getElementById("character");
const block = document.getElementById("block");
const overlay = document.getElementById("overlay");
const scoreEl = document.getElementById("score");
const hiEl = document.getElementById("hi");

// === 상태 정의 ===
const GAME = { READY: 0, PLAYING: 1, OVER: 2 };
let state = GAME.READY;

// === 물리 관련 변수 (단위: px, px/s, px/s²) ===
let y = 0;                 // 캐릭터 높이 (바닥 기준)
let vy = 0;                // 현재 속도
const GRAVITY = -2500;     // 중력 가속도
const JUMP_V  = 900;       // 점프 시 초기속도
let last = 0;              // 지난 프레임 시간 기록용 (ms)

// === 장애물 및 게임 진행 관련 ===
let blockX = 0;            // 장애물의 X좌표(px)
let speed = 220;           // 장애물 이동속도(px/s)
let passed = false;        // 장애물 통과 여부
let score = 0;             // 현재 점수
let hi = parseInt(localStorage.getItem("dino_hi") || "0", 10); // 최고점

// === 초기 화면 설정 ===
updateScore(0, hi);
placeBlockOffscreen();
updateOverlay(true, "CLICK / SPACE TO START", "JUMP: CLICK / SPACE / ↑");

// === 입력 처리 ===
function headleInput() {
  if (state === GAME.READY) start();   // 시작 전: 게임 시작
  else if (state === GAME.PLAYING) jump(); // 진행 중: 점프
  else if (state === GAME.OVER) restart(); // 게임 오버: 재시작
}

// 키보드 입력 (Space 또는 ↑)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") headleInput();
});

// 마우스 클릭으로도 조작 가능
document.addEventListener("click", headleInput);

// === 게임 시작 / 재시작 ===
function start() {
  state = GAME.PLAYING;
  overlay.style.display = "none";
  game.classList.remove("flash");

  // 기본값 초기화
  y = 0; vy = 0;
  speed = 220; score = 0;
  placeBlockOffscreen(); passed = false;

  last = performance.now(); // 루프 시작시간 기록
  ground.style.animationPlayState = "running";
  clouds.style.animationPlayState = "running";
  requestAnimationFrame(loop); // 메인 루프 시작
}

function restart() {
  updateOverlay(false);
  start();
}

// === 점프 ===
function jump() {
  // 바닥 근처일 때만 점프 (이중점프 방지)
  if (y <= 1) vy = JUMP_V;
}

// === 게임 루프 ===
function loop(t) {
  if (state !== GAME.PLAYING) return;
  const dt = (t - last) / 1000; // 밀리초 → 초
  last = t;

  // --- 물리 계산 (중력 및 속도 반영) ---
  vy += GRAVITY * dt;
  y += vy * dt;
  if (y < 0) { y = 0; vy = 0; } // 바닥 충돌 시 위치 보정

  // --- 캐릭터 위치 갱신 ---
  const floorY = 160;
  const charTop = floorY - 44 - y;
  character.style.top = `${charTop}px`;

  // --- 장애물 이동 ---
  blockX -= speed * dt;
  block.style.left = `${blockX}px`;

  // --- 점수 및 난이도 조정 ---
  const charX = 80;
  if (!passed && blockX + 26 < charX) {
    passed = true;
    addScore(10);
    speed = Math.min(speed + 10, 480); // 점점 빨라짐
    setTimeout(spawnBlock, rand(300, 900)); // 다음 장애물 등장
  }

  // --- 충돌 검사 ---
  const hit = collide(
    { x: charX, y: charTop,            w: 40, h: 44 },
    { x: blockX, y: floorY - 46,       w: 26, h: 46 },
  );
  if (hit) { gameOver(); return; }

  // --- 시간 점수 (시간당 1점) ---
  addScore(dt * 1);

  requestAnimationFrame(loop);
}

// === 게임 종료 처리 ===
function gameOver() {
  state = GAME.OVER;
  ground.style.animationPlayState = "paused";
  clouds.style.animationPlayState = "paused";
  game.classList.add("flash");

  // 최고점 갱신
  hi = Math.max(hi, Math.floor(score));
  localStorage.setItem("dino_hi", hi.toString());

  updateOverlay(true, "GAME OVER", "CLICK / SPACE To RESTART");
  updateScore(score, hi);
}

// === 장애물 관리 ===
function placeBlockOffscreen() {
  const gameW = parseInt(getComputedStyle(game).width, 10);
  blockX = gameW + rand(40, 120);
  block.style.left = `${blockX}px`;
}

function spawnBlock() {
  if (state !== GAME.PLAYING) return;
  passed = false;
  placeBlockOffscreen();
}

// === 점수 관련 ===
function addScore(delta) {
  score += delta;
  updateScore(score, hi);
}

function updateScore(cur, hiVal) {
  const s = Math.floor(cur).toString().padStart(5, "0");
  const h = Math.floor(hiVal).toString().padStart(5, "0");
  scoreEl.textContent = s;
  hiEl.textContent = `HI ${h}`;
}

// === 유틸 함수 ===

// AABB 충돌 판정
function collide(a, b) {
  return !(
    a.x + a.w < b.x ||
    b.x + b.w < a.x ||
    a.y + a.h < b.y ||
    b.y + b.h < a.y
  );
}

// 오버레이 텍스트 갱신
function updateOverlay(show, title, sub) {
  overlay.style.display = show ? "flex" : "none";
  if (title) document.getElementById("title").textContent = title;
  if (sub)   document.getElementById("subtitle").textContent = sub;
}

// 범위 내 랜덤값 반환
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
