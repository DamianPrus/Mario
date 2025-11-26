export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 32;
    this.height = 32;
    this.velocityX = 2;
    this.velocityY = 0;
    this.collected = false;
  }

  update() {
    if (this.collected) return;
    this.x += this.velocityX;
  }
}
