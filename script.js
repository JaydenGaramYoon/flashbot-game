const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const targetColorBox = document.getElementById("targetColorBox");
const startScreen = document.getElementById("startScreen");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScoreDisplay = document.getElementById("finalScore");
const clickSound = new Audio('sounds/click.mp3');
const successSound = new Audio('sounds/success.mp3');
const gameOverSound = new Audio('sounds/gameover.mp3');
const openingSound = new Audio('sounds/opening.mp3');
const backgroundMusic = new Audio('sounds/background.mp3');
openingSound.loop = true;  
openingSound.play();


const robotImages = {
    blue: 'images/blue_eye.png',
    red: 'images/red_eye.png',
    yellow: 'images/yellow_eye.png',
    green: 'images/green_eye.png'
};

let robot = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 800,
    height: 800,
    currentImage: robotImages.blue,
    currentColor: "blue",
};

let score = 0;
let level = 1;
let targetColor = "blue";
let changeInterval;
let changeSpeed = 1000;
let isRobotClickable = false;
let gameRunning = false;
let gameLoopId = null; 

function startGame() {
    openingSound.pause(); 
    backgroundMusic.play();
    backgroundMusic.loop = true;
    gameOverSound.pause();
    gameOverSound.currentTime = 0;

    
    gameRunning = false;
    clearInterval(changeInterval);
    if (gameLoopId !== null) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }


    score = 0;
    level = 1;
    changeSpeed = 1000;
    updateScore();
    startScreen.style.display = "none";

    document.getElementById("gameScreen").style.display = "block";
    gameOverOverlay.style.display = "none";
    gameRunning = true;

    targetColor = getRandomColor();
    setTargetColorBox(targetColor);


    startImageChangeInterval();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (gameRunning) {
        clearCanvas();
        drawRobot();

        const robotCenterX = robot.x;
        const robotCenterY = robot.y - robot.height / 4 - 10;
        targetColorBox.style.left = `${robotCenterX}px`;
        targetColorBox.style.top = `${robotCenterY}px`;

        gameLoopId = requestAnimationFrame(gameLoop); 
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawRobot() {
    const img = new Image();
    img.src = robot.currentImage;

    ctx.save(); 
    ctx.shadowBlur = 5; 
    ctx.shadowColor = "rgb(255, 255, 255)"; 
    ctx.shadowOffsetX = 0; 
    ctx.shadowOffsetY = 0; 

    ctx.drawImage(img, robot.x - robot.width / 2, robot.y - robot.height / 2, robot.width, robot.height);

    ctx.restore(); 
}

canvas.addEventListener("click", function () {
    if (gameRunning) {
        clickSound.play();  

        gameRunning = false;
        clearInterval(changeInterval);

        if (robot.currentColor === targetColor) {
            successSound.play();  
            score += 10;
            levelUp();
            updateScore();
            targetColor = getRandomColor();
            targetColorBox.textContent = targetColor.toUpperCase();
            targetColorBox.style.color = targetColor;
            setTargetColorBox(targetColor);
            gameRunning = true;
            startImageChangeInterval();
        } else {
            backgroundMusic.pause();
            gameOverSound.play();  
            showGameOver();
        }
    }
});


function startImageChangeInterval() {
    clearInterval(changeInterval); 
    changeInterval = setInterval(() => {
        const colors = ["blue", "red", "yellow", "green"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        robot.currentImage = robotImages[randomColor];
        robot.currentColor = randomColor;
        isRobotClickable = true;
    }, changeSpeed);
}

function levelUp() {
    level++;
    levelDisplay.textContent = level;
    changeSpeed = Math.max(50, changeSpeed - 50); 
    startImageChangeInterval(); 
}

function updateScore() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
}

function showGameOver() {
    openingSound.pause();
    finalScoreDisplay.textContent = score;
    gameOverOverlay.style.display = "block";
    clearInterval(changeInterval);
    if (gameLoopId !== null) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
    gameRunning = false;
}

function getRandomColor() {
    const colors = ["blue", "red", "yellow", "green"];
    return colors[Math.floor(Math.random() * colors.length)];
    
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    robot.x = canvas.width / 2;
    robot.y = canvas.height / 2;

    const robotCenterX = robot.x;
    const robotCenterY = robot.y - robot.height / 2 - 10;
    targetColorBox.style.left = `${robotCenterX}px`;
    targetColorBox.style.top = `${robotCenterY}px`;
}

function setTargetColorBox(color) {
    targetColorBox.textContent = color.toUpperCase(); 
    targetColorBox.style.color = color; 
    targetColorBox.style.borderColor = color;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
setTargetColorBox(targetColor);

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', startGame);
