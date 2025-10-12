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
updateOverlay(true, "CLICK / SPACE TO START", "JUMP: CLICK / SPACE / ")