const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export default class Particle {
  constructor(x, y, size, color) {
    this.size = size;
    this.x = x + size / 2 + Math.random() * 50 - 25;
    this.y = y + size / 3 + Math.random() * 50 - 25;
    this.color = color;
    this.radius = Math.random() * this.size / 10;
    this.maxRadius = Math.random() * 20 + 35;
    this.speedX = Math.random() * 1 + 0.5;
    this.markedForDeletion = false;
  }

  update() {
    this.x += this.speedX;
    this.radius += 0.8;

    if (this.radius >= this.maxRadius - 5) {
      this.markedForDeletion = true;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = 1 - this.radius / this.maxRadius;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}