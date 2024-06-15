const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export default class Layer {
  constructor(image, speedModifier, gameSpeed) {
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = canvas.height;
    this.gameSpeed = gameSpeed
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = gameSpeed * this.speedModifier;
  }

  update() {
    this.speed = this.gameSpeed * this.speedModifier;
    if (this.x >= this.width) {
      this.x = 0;
    }

    this.x = Math.floor(this.x + this.speed);
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x - this.width, this.y, this.width, this.height);
  }
}