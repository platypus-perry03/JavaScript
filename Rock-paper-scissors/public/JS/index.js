let userScore = 0;
let computerScore = 0;
const userScore_span = document.getElementById("user_score");
const computerScore_span = document.getElementById("computer_score");
const scoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");

function getComputerChoice() {
  const choices = ['r', 'p', 's'];
  const randomNumber = Math.floor(Math.random() * 3);
  return choices[randomNumber];
}

function convertToWord(letter) {
  if (letter === "r") return "Rock";
  if (letter === "p") return "Paper";
  return "Scissors";
}

function win(userChoice, computerChoice) {
  userScore++;
  userScore_span.innerHTML = userScore;
  computerScore_span.innerHTML = computerScore;

  const smallUserWord = "user".fontsize(3);
  const smallCompWord = "comp".fontsize(3);
  const userChoice_div = document.getElementById(userChoice);
  result_p.innerHTML =
    `${convertToWord(userChoice)}${smallUserWord} beats ` +
    `${convertToWord(computerChoice)}${smallCompWord}. ` +
    `!!!You Win!!!`;

  userChoice_div.classList.add('blue-glow');
  setTimeout(() => userChoice_div.classList.remove('blue-glow'), 700);
}

function lose(userChoice, computerChoice) {
  computerScore++;
  userScore_span.innerHTML = userScore;
  computerScore_span.innerHTML = computerScore;

  const smallUserWord = "user".fontsize(3).sub();
  const smallCompWord = "comp".fontsize(3).sub();
  const userChoice_div = document.getElementById(userChoice);

  // 컴퓨터가 유저를 이겼다고 표기
  result_p.innerHTML =
    `${convertToWord(computerChoice)}${smallCompWord} beats ` +
    `${convertToWord(userChoice)}${smallUserWord}. ` +
    `You Lost....`;

    userChoice_div.classList.add('red-glow');
  setTimeout(() => userChoice_div.classList.remove('red-glow'), 700);
}

function draw(userChoice, computerChoice) {
  const smallUserWord = "user".fontsize(3);
  const smallCompWord = "comp".fontsize(3);
  const userChoice_div = document.getElementById(userChoice);

  result_p.innerHTML =
    `${convertToWord(userChoice)}${smallUserWord} equals ` +
    `${convertToWord(computerChoice)}${smallCompWord}. ` +
    `DDDDRRRRAAAAWWWW!!!!`;

  userChoice_div.classList.add('purple-glow');
  setTimeout(() => userChoice_div.classList.remove('purple-glow'), 700);
}

function game(userChoice) {
  const computerChoice = getComputerChoice();
  switch (userChoice + computerChoice) {
    case "rs":
    case "pr":
    case "sp":
      win(userChoice, computerChoice);
      break;
    case "rp":
    case "ps":
    case "sr":
      lose(userChoice, computerChoice);
      break;
    case "rr":
    case "pp":
    case "ss":
      draw(userChoice, computerChoice);
      break;
  }
}

function main() {
  rock_div.addEventListener('click', () => game("r"));

  paper_div.addEventListener('click', () => game("p"));
  
  scissors_div.addEventListener('click', () => game("s"));
}

main();
