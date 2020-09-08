let player;
let player2;
let ball;
let cursors;
let gameStarted = false;
let scoreText;
let server = 1;
let player1Score = 0;
let player2Score = 0;

const rectangles = [];

// This object contains all the Phaser configurations to load our game
const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 640,
  heigth: 800,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: false,
      debug: true,
    },
  },
};

// Create the game instance
// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);

function preload() {
  this.load.image('ball', 'static/assets/images/ball_32_32.png');
  this.load.image('paddle', 'static/assets/images/paddle_128_32.png');
}

function create() {
  scoreText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2 - 72,
    '0',
    {
      fontFamily: 'Monaco, Courier, monospace',
      fontSize: '72px',
      fill: '#fff',
    },
  );

  scoreText.setOrigin(0.5);

  scoreText2 = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2 + 72,
    '0',
    {
      fontFamily: 'Monaco, Courier, monospace',
      fontSize: '72px',
      fill: '#fff',
    },
  );

  scoreText2.setOrigin(0.5);

  const graphics = this.add.graphics();

  player = this.physics.add.sprite(
    320, // x position
    760, // y position
    'paddle', // key of image for the sprite
  );

  player2 = this.physics.add.sprite(
    320, // x position
    40, // y position
    'paddle', // key of image for the sprite
  );

  const initialBallPos = server === 0 ? 720 : 80;

  ball = this.physics.add.sprite(
    400, // x position
    initialBallPos, // y position
    'ball', // key of image for the sprite
  );

  cursors = this.input.keyboard.createCursorKeys();

  player.setCollideWorldBounds(true);
  player2.setCollideWorldBounds(true);
  ball.setCollideWorldBounds(true);

  ball.setBounce(1, 1);

  // this.physics.world.checkCollision.down = false;

  player.setImmovable(true);
  player2.setImmovable(true);

  this.physics.add.collider(ball, player, hitPlayer, null, this);
  this.physics.add.collider(ball, player2, hitPlayer, null, this);

  for (let i = 0; i < 640; i += 25) {
    rectangles.push(new Phaser.Geom.Rectangle(i, 400, 10, 6));
  }

  graphics.fillStyle(0xffffff, 1.0);

  rectangles.forEach((rect) => {
    graphics.fillRectShape(rect);
  });

  this.physics.world.checkCollision.down = false;

  this.physics.world.checkCollision.up = false;
}

function update() {
  if (player1Scored()) {
    player1Score += 1;
    scoreText.setText(player1Score);
    ball.setX(player2.x);
    ball.setY(80);
    ball.setVelocityX(0);
    ball.setVelocityY(0);
    server = 1;
    scoreText.setVisible(true);
    scoreText2.setVisible(true);
    gameStarted = false;
  } else if (player2Scored(this.physics.world)) {
    player2Score += 1;
    scoreText2.setText(player2Score);
    ball.setX(player.x);
    ball.setY(720);
    ball.setVelocityX(0);
    ball.setVelocityY(0);
    server = 0;
    scoreText.setVisible(true);
    scoreText2.setVisible(true);
    gameStarted = false;
  }

  // Put this in so that the player stays still if no key is being pressed
  player.body.setVelocityX(0);
  player2.body.setVelocityX(0);

  if (cursors.left.isDown) {
    player.body.setVelocityX(-350);
    player2.body.setVelocityX(350);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(350);
    player2.body.setVelocityX(-350);
  }

  if (!gameStarted) {
    ball.setX(server === 0 ? player.x : player2.x);

    if (cursors.space.isDown) {
      gameStarted = true;

      ball.setVelocityY(server === 0 ? -200 : 200);

      randNum = Math.random();
      if (randNum >= 0.5) {
        ball.setVelocityX(150);
      } else {
        ball.setVelocityX(-150);
      }

      scoreText.setVisible(false);
      scoreText2.setVisible(false);
    }
  }
}

function hitPlayer(targetBall, targetPlayer) {
  // Increase the velocity of the ball after it bounces
  targetBall.setVelocityY(targetBall.body.velocity.y - 5);

  const newXVelocity = Math.abs(targetBall.body.velocity.x) + 5;
  // If the ball is to the left of the player, ensure the X-velocity is negative
  if (targetBall.x < targetPlayer.x) {
    targetBall.setVelocityX(-newXVelocity);
  } else {
    targetBall.setVelocityX(newXVelocity);
  }
}

function player1Scored() {
  return ball.body.y < 0;
}

function player2Scored(world) {
  return ball.body.y > world.bounds.height;
}
