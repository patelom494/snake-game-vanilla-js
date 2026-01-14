const board = document.querySelector('.board');
const startbutton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGame = document.querySelector(".start-game");
const gameOver = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart")
const highscoreElem = document.querySelector(".highscore")
const scoreElem = document.querySelector(".score")
const timeElem = document.querySelector(".time")

const boxs = [];
let snake = [{ x: 5, y: 5 },];
let direction = 'down';
let intervalId = null;
let timerIntervalId = null;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let score = 0;
let time = '00:00';
highscoreElem.textContent = highScore;



const rows = Math.floor(board.clientHeight / 30);
const cols = Math.floor(board.clientWidth / 30);

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const box = document.createElement("div");
        box.classList.add('box');
        board.appendChild(box);
        // box.textContent = (`${row},${col}`);
        boxs[`${row}-${col}`] = box;
    }
}


// intervalId = setInterval(() => {
//     Render()
// }, 300);


//start game button
startbutton.addEventListener('click', () => {
    modal.style.display = "none"
    intervalId = setInterval(() => { Render() }, 300);
    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split(":").map(Number);

        if (sec == 59) {
            min += 1;
            sec = 0;
        } else {
            sec += 1;
        }

        time = `${min} : ${sec}`;
        timeElem.textContent = time;
    }, 1000)
})


//errow key press event and direction value 
addEventListener('keydown', (dets) => {
    if (dets.key == "ArrowUp") {
        direction = 'up'
    } else if (dets.key == "ArrowDown") {
        direction = 'down'
    } else if (dets.key == "ArrowLeft") {
        direction = 'left'
    } else if (dets.key == "ArrowRight") {
        direction = 'right'
    }
});


//restart game logic
restartButton.addEventListener("click", () => {
    boxs[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(ele => {
        boxs[`${ele.x}-${ele.y}`].classList.remove('snake');
    })

    modal.style.display = "none"
    snake = [{ x: 5, y: 5 },];
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    intervalId = setInterval(() => { Render() }, 300);

    score = 0;
    time = '00:00';

    scoreElem.textContent = score;
    timeElem.textContent = '00:00';
    highscoreElem.textContent = highScore;
})


//snake render
function Render() {

    let head = null;
    boxs[`${food.x}-${food.y}`].classList.add("food");

    if (direction == 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction == "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction == "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    } else if (direction == "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    }

    //wall collision logic
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        modal.style.display = "flex"
        gameOver.style.display = "flex"
        startGame.style.display = "none"
        clearInterval(intervalId);
        return;
    }
    // food cunsume logic
    if (head.x == food.x && head.y == food.y) {
        boxs[`${food.x}-${food.y}`].classList.remove("food");
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
        snake.unshift(head);
        score += 1;
        scoreElem.textContent = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore.toString());
        }
    }

    snake.forEach(ele => {
        boxs[`${ele.x}-${ele.y}`].classList.remove('snake');
    })

    snake.unshift(head);
    snake.pop();

    snake.forEach(ele => {
        boxs[`${ele.x}-${ele.y}`].classList.add('snake');
    })
}



//highscore logic 

