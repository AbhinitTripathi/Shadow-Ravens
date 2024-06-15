import Explosion from "./scripts/explosions.js";
import Layer from "./scripts/layer.js";
import Raven from "./scripts/ravens.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Make sure that the game start sonly when the page is loaded
window.addEventListener("load", () => {

    // Collision Canvas (to overcome tainted image error)
    const collisionCanvas = document.getElementById("collisionCanvas");
    const collisonCtx = collisionCanvas.getContext("2d");
    collisionCanvas.width = window.innerWidth;
    collisionCanvas.height = window.innerHeight;

    // Dynamically controll game speed
    let gameSpeed = 5;

    // Game variables
    let bullets = 12;
    const reload = new Audio();
    reload.src = "/assets/Audio/reload.wav";

    const empty = new Audio();
    empty.src = "/assets/Audio/outofammo.wav";

    const gameBg = new Audio();
    gameBg.src = "/assets/Audio/gameBgAudio1.wav";


    let score = 0;
    let gameOver = { state: false };
    let highScore = localStorage.getItem("highScore");
    if(!highScore){
        highScore = 0;
        localStorage.setItem("highScore", highScore);
    }

    ctx.font = "50px Impact";

    // Manually make Intervals
    let timeToNextRaven = 0;
    let ravenInterval = 500;
    let lastTime = 0;

    // Initialize Objects Array
    let ravensArray = [];
    let particleArray = [];
    let explosionArray = [];
    
    // Shoot
    window.addEventListener('click', (e) => {
        const detectPixelColor = collisonCtx.getImageData(e.x, e.y, 1, 1);
        const pc = detectPixelColor.data;
        ravensArray.forEach(raven => {
            if(bullets == 0 && !gameOver.state) {
                empty.play();
            } else if (
                raven.randomColors[0] == pc[0] &&
                raven.randomColors[1] == pc[1] &&
                raven.randomColors[2] == pc[2]
            ){
                raven.markedForDeletion=true;
                if (raven.hasTrail === true) score+=3;
                else score++;
                if(bullets > 0) bullets--;
                explosionArray.push(new Explosion(raven.x, raven.y, raven.width));
            }
        });
    });

    // Reload
    window.addEventListener('contextmenu', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if(bullets < 12 && !gameOver.state){
            bullets = 12;
            reload.currentTime = 1;
            reload.play();
        }
    });

    const drawScore = () => {
        // Score
        ctx.textAlign = "left"
        ctx.fillStyle = "black";
        ctx.fillText(`Score: ${score}`, 60, 83);
        ctx.fillStyle = "white";
        ctx.fillText(`Score: ${score}`, 65, 80);
        if (score > 1 && score % 30 == 0) gameSpeed += 0.1;
        
        // Bullets
        ctx.textAlign = "right"
        ctx.fillStyle = "black";
        ctx.fillText(`Bullets: ${bullets}`, canvas.width-60, 83);
        ctx.fillStyle = "white";
        ctx.fillText(`Bullets: ${bullets}`, canvas.width-65, 80);
        if (score > 1 && score % 30 == 0) gameSpeed += 0.1;
    }

    const drawGameOver = () => {
        ctx.textAlign = "center";
        
        const gameOverAudio = new Audio();
        gameOverAudio.src = "/assets/Audio/gameOver.wav";
        gameOverAudio.play();
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        
        // Original Text
        ctx.fillStyle = "white";
        ctx.fillText(`GAME OVER!!!`, canvas.width*0.5+5, canvas.height*0.5-100);
        ctx.fillText(`your score is: ${score}`, canvas.width * 0.5+5, (canvas.height * 0.5)-50);
        ctx.fillText(`Press ENTER to RESTART`, canvas.width * 0.5+5, (canvas.height * 0.5)+40);

        if (score >= highScore) {
            localStorage.setItem("highScore", score);
            highScore = score;
            ctx.fillText(`NEW HIGH SCORE: ${score}`, canvas.width * 0.5 + 5, canvas.height * 0.5 + 185);
        } else {
            ctx.fillText(`CURRENT HIGH SCORE: ${highScore}`, canvas.width * 0.5 + 5, canvas.height * 0.5 + 185);
        }

        window.addEventListener("keydown", (e) => {
            if(e.key === "Enter"){
                location.reload();
            }
        });
    }

    const startGame = () => {
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillText(`Press ENTER to START`, canvas.width * 0.5, canvas.height * 0.5);

        window.addEventListener("keypress", (e) => {
            if(e.key === "Enter"){
                gameBg.play();
                animate();
            }
        });
    }


    // Background layer
    const backgroundLayer1 = new Image();
    backgroundLayer1.src = "/assets/Images/layer-1.png";
    const backgroundLayer2 = new Image();
    backgroundLayer2.src = "/assets/Images/layer-2.png";
    const backgroundLayer3 = new Image();
    backgroundLayer3.src = "/assets/Images/layer-3.png";
    const backgroundLayer4 = new Image();
    backgroundLayer4.src = "/assets/Images/layer-4.png";
    const backgroundLayer5 = new Image();
    backgroundLayer5.src = "/assets/Images/layer-5.png";


    const layer1 = new Layer(backgroundLayer1, 0.2, gameSpeed);
    const layer2 = new Layer(backgroundLayer2, 0.3, gameSpeed);
    const layer3 = new Layer(backgroundLayer3, 0.5, gameSpeed);
    const layer4 = new Layer(backgroundLayer4, 0.7, gameSpeed);
    const layer5 = new Layer(backgroundLayer5, 1, gameSpeed);
    const gameObject = [layer1, layer2, layer3, layer4, layer5];
    
    const animate = (timestamp = 0) => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        collisonCtx.clearRect(0, 0, canvas.width, canvas.height);
        gameObject.forEach((layer) => {
            layer.draw();
            layer.update();
        });
    
        // DELAT TIME = difference of timestamp in this and previous loop
        let deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        timeToNextRaven += deltaTime;
        if(timeToNextRaven > ravenInterval) {
            ravensArray.push(new Raven());
            timeToNextRaven = 0;
            ravensArray.sort((a,b) => {
                return a.width - b.width;
            });
        };

        drawScore();
        [...particleArray, ...ravensArray, ...explosionArray].forEach(raven => raven.draw());
        [...particleArray, ...ravensArray, ...explosionArray].forEach(raven => raven.update(deltaTime,score, gameOver, particleArray));
        
        // remove ravens moved past the left edge
        ravensArray = ravensArray.filter(raven => !raven.markedForDeletion);
        
        // Remove Animated explosions
        explosionArray = explosionArray.filter(explosion => !explosion.markedForDeletion);
        
        // Remove Animated particles
        particleArray = particleArray.filter(particle => !particle.markedForDeletion);
        
        
        if(!gameOver.state){
            requestAnimationFrame(animate);
        } else {
            gameBg.pause();
            drawGameOver();
        }
    }; startGame();
});