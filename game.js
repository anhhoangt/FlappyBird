const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
//we will need the game container to make it blurry when we display the game over screen
const gameContainer = document.getElementById("game-container");

const flappyImg = new Image();
flappyImg.src = "assets/bird.jpeg";

//game constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 80;
const BIRD_HEIGHT = 50;
const PIPE_WIDTH = 60;
const PIPE_GAP = 130;

//bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

//score and high score variables
let scoreDiv = document.getElementById("score-display");
let score = 0;
let highScore = 0;

//add a boolean variable to check if the bird passes we increase the value
let scored = false;

//control space key
document.body.onkeyup = function (e) {
  if (e.code == "Space") {
    birdVelocity = FLAP_SPEED;
  }
};

//restart the game if we hit game over
document
  .getElementById("restart-button")
  .addEventListener("click", function () {
    hideEndMenu();
    resetGame();
    loop();
  });

function increaseScore() {
  //increase the score when we pass a pipe
  if (
    birdX > pipeX + PIPE_WIDTH &&
    (birdY < pipeY + PIPE_GAP || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
    !scored
  ) {
    score++;
    scoreDiv.innerText = score;
    scored = true;
  }
  //reset the scored variable when we pass the pipe
  if (birdX < pipeX + PIPE_WIDTH) {
    scored = false;
  }
}

function collisionCheck() {
  //create bounding boxes for the bird and the pipe
  const birdBox = {
    x: birdX,
    y: birdY,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT,
  };
  const topPipeBox = {
    x: pipeX,
    y: pipeY - PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: pipeY,
  };
  const bottomPipeBox = {
    x: pipeX,
    y: pipeY + PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: canvas.height - pipeY - PIPE_GAP,
  };

  //check if the bird collides with the upper pipe
  if (
    birdBox.x < topPipeBox.x + topPipeBox.width &&
    birdBox.x + birdBox.width > topPipeBox.x &&
    birdBox.y < topPipeBox.y
  ) {
    return true;
  }
  //check if the bird collides with the bottom pipe
  if (
    birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
    birdBox.x + birdBox.width > bottomPipeBox.x &&
    birdBox.y + birdBox.height > bottomPipeBox.y
  ) {
    return true;
  }
  //check if the bird collides with the ground
  if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
    return true;
  }
  return false;
}

function hideEndMenu() {
  document.getElementById("end-menu").style.display = "none";
  gameContainer.classList.remove("backdrop-blur");
}

function showEndMenu() {
  document.getElementById("end-menu").style.display = "block";
  gameContainer.classList.add("backdrop-blur");
  document.getElementById("end-score").innerText = score;
  //update high score
  if (score > highScore) {
    highScore = score;
  }
  //display high score
  document.getElementById("best-score").innerText = highScore;
}

//reset the game variables
//bird will start at the beginning
function resetGame() {
  //bird variables
  birdX = 50;
  birdY = 50;
  birdVelocity = 0;
  birdAcceleration = 0.1;

  //pipe variables
  pipeX = 400;
  pipeY = canvas.height - 200;

  score = 0;
}

function endGame() {
  showEndMenu();
}

function loop() {
  // reset the ctx after every loop iteration
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //draw the bird
  ctx.drawImage(flappyImg, birdX, birdY, BIRD_WIDTH, BIRD_HEIGHT);

  //draw the pipe
  ctx.fillStyle = "#333";
  //top pipe
  ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
  //bottom pipe
  ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

  //check for collision and display the end menu if there is one and end the game
  if (collisionCheck()) {
    endGame();
    return;
  }

  //move the pipe
  pipeX -= 1.5;
  //if the pipe is out of the screen, reset it
  if (pipeX < -50) {
    //appear from the right side of the screen
    pipeX = 400;
    //randomize the pipe height
    pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
  }

  //apply gravity to the bird and let it move
  birdVelocity += birdAcceleration;
  birdY += birdVelocity;

  increaseScore();

  requestAnimationFrame(loop);
}

loop();
