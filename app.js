const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 640;
const canvasHeight = 480;

canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";

const scale = window.devicePixelRatio;
canvas.width = Math.floor(canvasWidth * scale);
canvas.height = Math.floor(canvasHeight * scale);

ctx.scale(scale, scale);

let x = canvasWidth / 2;
let y = canvasHeight - 30;

const INITIAL_SPEED = 4;

let dx = INITIAL_SPEED;
let dy = -INITIAL_SPEED;

const ballRadius = 10;

const paddleHeight = 20;
const paddleWidth = 80;
let paddleY = (canvasHeight - paddleWidth) / 2;
let paddle2Y = (canvasHeight - paddleWidth) / 2;

let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

let score1 = 0;
let score2 = 0;

let isPaused = true;

function drawLine() {
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 4;
  ctx.moveTo(canvasWidth / 2, 0);
  ctx.lineTo(canvasWidth / 2, canvasHeight);
  ctx.stroke();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#FFF';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle1() {
  ctx.beginPath();
  ctx.rect(0, paddleY, paddleHeight, paddleWidth);
  ctx.fillStyle = '#FFF';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle2() {
  ctx.beginPath();
  ctx.rect(canvasWidth - paddleHeight, paddle2Y, paddleHeight, paddleWidth);
  ctx.fillStyle = '#FFF';
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = '72px Courier';
  ctx.fillStyle = '#FFF';
  ctx.textAlign = 'end';
  ctx.fillText(score1, canvasWidth / 2 - 36, 80);
  ctx.textAlign = 'start';
  ctx.fillText(score2, canvasWidth / 2 + 36, 80);
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawLine();
  drawBall();
  drawPaddle1();
  drawPaddle2();
  drawScore();
  collisionHandler();

  if (x + dx > canvasWidth - ballRadius) {
    dx = -dx;
    score1 += 1;

    x = canvasWidth / 2;
    y = canvasHeight - 30;

    dx = INITIAL_SPEED;
    dy = -INITIAL_SPEED;

    paddleY = (canvasHeight - paddleWidth) / 2;
    paddle2Y = (canvasHeight - paddleWidth) / 2;
  }
  if (x + dx < ballRadius) {
    dx = -dx;
    score2 += 1;

    x = canvasWidth / 2;
    y = canvasHeight - 30;

    dx = INITIAL_SPEED;
    dy = -INITIAL_SPEED;

    paddleY = (canvasHeight - paddleWidth) / 2;
    paddle2Y = (canvasHeight - paddleWidth) / 2;
  }
  if (y + dy < ballRadius || y + dy > canvasHeight - ballRadius) {
    dy = -dy;
  }

  if (downPressed) {
    paddle2Y += 7;
  } else if (upPressed) {
    paddle2Y -= 7;
  }

  if (sPressed) {
    paddleY += 7;
  } else if (wPressed) {
    paddleY -= 7;
  }

  x += dx;
  y += dy;

  if (!isPaused) {
    requestAnimationFrame(draw);
  }
}

function collisionHandler() {
  if (x + dx < ballRadius + paddleHeight && y <= paddleY + paddleWidth && y >= paddleY) {
    dx = -dx;
  }

  if (x + dx > canvasWidth - ballRadius - paddleHeight && y <= paddle2Y + paddleWidth && y >= paddle2Y) {
    dx = -dx;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvasWidth) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key === 'Up' || e.key === 'ArrowUp') {
    upPressed = true;
  } else if (e.key === 'Down' || e.key === 'ArrowDown') {
    downPressed = true;
  }

  if (e.keyCode === 87) {
    wPressed = true;
  } else if (e.keyCode === 83) {
    sPressed = true;
  }

  if (e.keyCode === 32) {
    if (isPaused) {
      isPaused = false;
      requestAnimationFrame(draw);
    } else {
      isPaused = true;
    }
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 87) {
    wPressed = false;
  } else if (e.keyCode === 83) {
    sPressed = false;
  }

  if (e.key === 'Up' || e.key === 'ArrowUp') {
    upPressed = false;
  } else if (e.key === 'Down' || e.key === 'ArrowDown') {
    downPressed = false;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

draw();