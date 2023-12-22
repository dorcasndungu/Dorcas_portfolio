document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('snake');
    const context = canvas.getContext('2d');

    const snake = {
        body: [{ x: 50, y: 50 }],
        size: 10,
        direction: 'right',
    };

    let food = {
        x: 0,
        y: 0,
        size: 10,
    };

    let gameOver = false;
    let gameStarted = false;

    function drawSnake() {
        context.fillStyle = '#4caf50'; // Snake color is blue
        snake.body.forEach(segment => {
            context.fillRect(segment.x, segment.y, snake.size, snake.size);
        });
    }

    function drawFood() {
        context.fillStyle = '#ff3258'; // Food color is pink
        context.fillRect(food.x, food.y, food.size, food.size);
    }

    function updateSnake() {
        if (gameOver) return;

        const head = { ...snake.body[0] }; // Create a new head

        switch (snake.direction) {
            case 'up':
                head.y -= snake.size;
                break;
            case 'down':
                head.y += snake.size;
                break;
            case 'left':
                head.x -= snake.size;
                break;
            case 'right':
                head.x += snake.size;
                break;
        }

        // Check for collisions with the canvas boundaries
        if (
            head.x < 0 ||
            head.x >= canvas.width ||
            head.y < 0 ||
            head.y >= canvas.height
        ) {
            gameOver = true;
            showGameOver();
            return;
        }

        // Check for collisions with the snake's own body
        for (let i = 1; i < snake.body.length; i++) {
            if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
                gameOver = true;
                showGameOver();
                return;
            }
        }

        snake.body.unshift(head); // Add the new head to the front

        // Check for collisions with food
        if (head.x === food.x && head.y === food.y) {
            // Generate new random coordinates for the food
            food.x = Math.floor(Math.random() * (canvas.width / snake.size)) * snake.size;
            food.y = Math.floor(Math.random() * (canvas.height / snake.size)) * snake.size;
        } else {
            // Remove the tail if the snake did not eat the food
            snake.body.pop();
        }
    }

    function showGameOver() {
        context.fillStyle = '#000';
        context.font = '30px sans-serif'; // Change the font here
        const text = "Game Over :'(";
        const textWidth = context.measureText(text).width;
        const x = (canvas.width - textWidth) / 2;
        const y = canvas.height / 2;
        context.fillText(text, x, y);

        setTimeout(() => {
            hideGameOver();
            showInstructions();
        }, 3000);
    }

    function hideGameOver() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        gameOver = false;
        unlockScrollbar();
        resetGame();
    }

    function resetGame() {
        snake.body = [{ x: 50, y: 50 }];
        snake.direction = 'right';
        food.x = Math.floor(Math.random() * (canvas.width / snake.size)) * snake.size;
        food.y = Math.floor(Math.random() * (canvas.height / snake.size)) * snake.size;
        unlockScrollbar();
    }

    function showInstructions() {
        const instructionsContainer = document.querySelector('.instructions-container');
        instructionsContainer.style.display = 'block';
        
    }

    function hideInstructions() {
        const instructionsContainer = document.querySelector('.instructions-container');
        instructionsContainer.style.display = 'none';
    }

    function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (gameStarted) {
            drawFood();
            drawSnake();
            updateSnake();
        }

        if (!gameOver) {
            requestAnimationFrame(function () {
                setTimeout(gameLoop, 80); // Adjust the delay (100 milliseconds in this case)
            });
        }
    }

    function lockScrollbar() {
        document.body.style.overflow = 'hidden';
    }

    function unlockScrollbar() {
        document.body.style.overflow = 'auto';
    }

    document.addEventListener('keydown', function (event) {
        if (!gameStarted) return;

        // Prevent the default behavior of arrow keys (scrolling)
        if (event.key.startsWith('Arrow')) {
            event.preventDefault();
        }

        switch (event.key) {
            case 'ArrowUp':
                snake.direction = 'up';
                break;
            case 'ArrowDown':
                snake.direction = 'down';
                break;
            case 'ArrowLeft':
                snake.direction = 'left';
                break;
            case 'ArrowRight':
                snake.direction = 'right';
                break;
        }
    });

    document.getElementById('start-button').addEventListener('click', function () {
        gameStarted = true;
        hideInstructions();
        resetGame(); // Reset the game state
        gameLoop();
    });

    // Initialize the food position
    food.x = Math.floor(Math.random() * (canvas.width / snake.size)) * snake.size;
    food.y = Math.floor(Math.random() * (canvas.height / snake.size)) * snake.size;
});