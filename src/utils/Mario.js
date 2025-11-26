export class Mario {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
    this.big = false;
    this.invincible = false;
    this.direction = 'right';

    // Movement constants
    this.acceleration = 0.5;
    this.maxSpeed = 4;
    this.friction = 0.8;
    this.jumpPower = 12;
  }

  moveLeft() {
    this.direction = 'left';
    this.velocityX -= this.acceleration;
    if (this.velocityX < -this.maxSpeed) {
      this.velocityX = -this.maxSpeed;
    }
  }

  moveRight() {
    this.direction = 'right';
    this.velocityX += this.acceleration;
    if (this.velocityX > this.maxSpeed) {
      this.velocityX = this.maxSpeed;
    }
  }

  decelerate() {
    this.velocityX *= this.friction;
    if (Math.abs(this.velocityX) < 0.1) {
      this.velocityX = 0;
    }
  }

  jump() {
    if (this.onGround) {
      this.velocityY = -this.jumpPower;
      this.onGround = false;
    }
  }

  update() {
    // Physics updates are handled in Game.jsx
  }
}
