export class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.dead = false;
    this.velocityY = 0;
    this.onGround = false;

    if (type === 'goomba') {
      this.width = 32;
      this.height = 32;
      this.velocityX = -1;
    } else if (type === 'koopa') {
      this.width = 32;
      this.height = 40;
      this.velocityX = -1.5;
      this.shell = false;
    }
  }

  update() {
    if (this.dead) return;

    this.x += this.velocityX;

    // Simple AI - just walk back and forth
  }

  kill() {
    this.dead = true;
  }
}
