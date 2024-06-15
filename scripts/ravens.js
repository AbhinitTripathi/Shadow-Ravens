import Particle from "./particles.js";

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Collision Detection
const collisionCanvas = document.getElementById("collisionCanvas");
const collisonCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

export default class Raven {
  constructor() {
    this.image = new Image();
    this.image.src = "/assets/Images/raven.png";
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizemodifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizemodifier;
    this.height = this.spriteHeight * this.sizemodifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.frame = 0;
    this.maxFarme = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [
      Math.floor(Math.random() * 255), // RED
      Math.floor(Math.random() * 255), // GREEN
      Math.floor(Math.random() * 255)  // BLUE
    ];
    this.color = `rgb(
                ${this.randomColors[0]},
                ${this.randomColors[1]},
                ${this.randomColors[2]}
            )`;
    this.hasTrail = Math.random() > 0.9;
    this.angle = 0;
    this.curve = Math.random() * 6;
  }

  update(deltaTime, score, gameOver, particleArray) {

    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1;
    }

    // Increase Raven speed for difficulty & score
    if (score > 1 && score % 30 == 0) {
      this.directionX += 0.01;
      this.directionY += 0.01;
    }

    this.x -= this.directionX;
    this.y += this.directionY * (Math.floor(Math.sin(this.angle) * this.curve));
    this.angle += 0.02;
    if (this.x < (0 - this.width)) this.markedForDeletion = true;

    this.timeSinceFlap += deltaTime;
    if (this.timeSinceFlap > this.flapInterval) {
      this.frame = (this.frame > this.maxFarme) ? 0 : this.frame + 1;
      this.timeSinceFlap = 0;

      if (this.hasTrail) {
        for (let i = 0; i < 5; i++) {
          particleArray.push(new Particle(this.x, this.y, this.width, this.color));
        }
      }

    }

    if (this.x < 0 - this.width) gameOver.state = true;
  }

  draw() {
    collisonCtx.fillStyle = this.color;
    collisonCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth, 0,
      this.spriteWidth, this.spriteHeight,
      this.x, this.y,
      this.width, this.height
    );
  }
};