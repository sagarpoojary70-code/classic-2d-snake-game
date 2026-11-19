
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game variables
let snake;
let direction;
let nextDirection;
let food;

let score = 0;
let gameRunning = false;
let gameLoop = null;

let speed = 300;

// Speed settings
const INITIAL_SPEED = 300;
const MIN_SPEED = 70;
const SPEED_INCREASE = 15;

// Initialize snake
function initializeSnake() {

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
}

// Spawn food
function spawnFood() {

    do {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };

    } while (
        snake.some(segment =>
            segment.x === food.x &&
            segment.y === food.y
        )
    );
}

// Start game
function startGame() {

    document.getElementById("startScreen")
        .classList.add("hidden");

    document.getElementById("gameOver")
        .classList.add("hidden");

    score = 0;
    speed = INITIAL_SPEED;

    initializeSnake();
    spawnFood();

    gameRunning = true;

    updateScore();
    drawGame();
    updateSpeedLevel();

    startGameLoop();
}

// Game loop
function startGameLoop() {

    clearInterval(gameLoop);

    gameLoop = setInterval(updateGame, speed);
}

// Keyboard controls
document.addEventListener("keydown", function(event) {

    const controls = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };

    const newDirection = controls[event.key];

    if (!newDirection || !gameRunning) return;

    event.preventDefault();

    if (
        newDirection.x + direction.x === 0 &&
        newDirection.y + direction.y === 0
    ) {
        return;
    }

    nextDirection = newDirection;
});

// Draw snake
function drawSnake() {

    snake.forEach((segment, index) => {

        ctx.fillStyle =
            index === 0 ? "#39ff14" : "#20c997";

        ctx.fillRect(
            segment.x * gridSize,
            segment.y * gridSize,
            gridSize - 2,
            gridSize - 2
        );
    });
}

// Draw food
function drawFood() {

    ctx.fillStyle = "#ff4757";

    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize - 2,
        gridSize - 2
    );
}

// Collision detection
function checkCollision(head, growing) {

    // Wall collision
    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
    ) {
        return true;
    }

    // Body collision
    const body = growing ? snake : snake.slice(0, -1);

    return body.some(segment =>
        segment.x === head.x &&
        segment.y === head.y
    );
}

// Main game update
function updateGame() {

    if (!gameRunning) return;

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    const eatingFood =
        head.x === food.x &&
        head.y === food.y;

    if (checkCollision(head, eatingFood)) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (eatingFood) {

        score += 10;

        updateScore();

        spawnFood();

        increaseSpeed();

    } else {

        snake.pop();
    }

    drawGame();
}

// Increase speed when snake grows
function increaseSpeed() {

    speed = Math.max(
        MIN_SPEED,
        INITIAL_SPEED - (snake.length - 3) * SPEED_INCREASE
    );

    updateSpeedLevel();

    // Restart timer with new speed
    startGameLoop();
}

// Display speed level
function updateSpeedLevel() {

    const level = Math.floor(
        (INITIAL_SPEED - speed) / SPEED_INCREASE
    ) + 1;

    document.getElementById("speedLevel")
        .textContent = "Speed Level: " + level;
}

// Update score
function updateScore() {

    document.getElementById("score")
        .textContent = score;
}

// Draw game
function drawGame() {

    ctx.clearRect(
        0, 0,
        canvas.width,
        canvas.height
    );

    drawSnake();
    drawFood();
}

// Game over
function endGame() {

    gameRunning = false;

    clearInterval(gameLoop);

    document.getElementById("finalScore")
        .textContent = score;

    document.getElementById("gameOver")
        .classList.remove("hidden");
}

// Restart game
function restartGame() {

    document.getElementById("gameOver")
        .classList.add("hidden");

    startGame();
}

// Initial screen
initializeSnake();
spawnFood();
drawGame();
updateScore();
