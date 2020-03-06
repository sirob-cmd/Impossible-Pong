let canvas = document.querySelector('#canvas')
let context = canvas.getContext('2d')

let pcScore = document.querySelector('.pcScore')
let playerScore = document.querySelector('.playerScore')

// player pad
const player = {
    playerScoreTracker: 0,
    x: 10,
    y: canvas.height / 2 - 40,
    width: 15,
    height: 100,
    radius: 8,
    draw: function () {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = "green";
        context.fill();
        context.closePath();
    },
}

canvas.addEventListener('mousemove', (e) => {
    player.y = e.offsetY - player.height / 2
})

// pc pad
const pc = {
    pcScoreTracker: 0,
    x: canvas.width - 25,
    y: canvas.height / 2 - 40,
    width: 15,
    height: 100,
    speed: 15,
    draw: function () {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = "red";
        context.fill();
        context.closePath();
    },

    move: function () {
        // this.y = ball.y - this.height / 2
        // (AI)
        if (this.y > ball.y - (this.height / 2)) {
            if (ball.velX === 4) this.y -= this.speed / 2;
            else this.y -= this.speed / 4;
        }
        if (this.y < ball.y - (this.height / 2)) {
            if (ball.velX === 4) this.y += this.speed / 2;
            else this.y += this.speed / 4;
        }
    }

}

// ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 15,
    height: 15,
    radius: 15 / 2,
    velX: 5,
    velY: 5,
    speed: 7,
    draw: function () {
        context.beginPath();
        context.arc(this.x, this.y, 10, 0, Math.PI * 2);
        context.fillStyle = "white";
        context.fill();
    },

    move: function () {
        this.y += this.velY
        this.x -= this.velX

        // top and bottom walls
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.velY = -this.velY;
        }
    }
}

const net = {
    x: canvas.width / 2,
    y: 0,
    height: 10,
    width: 2,
    draw: function () {
        for (let i = 0; i <= canvas.height; i += 15) {
            context.fillRect(this.x, this.y + i, this.width, this.height);
            context.fillStyle = "white"
            context.fill()
        }
    },
}

// collision with PC
function collision(b, paddle) {
    let pcL = paddle.x
    let pcT = paddle.y
    let pcB = paddle.y + paddle.height
    let pcR = paddle.x + paddle.width

    let bR = b.x + b.radius
    let bL = b.x - b.radius
    let bT = b.y - b.radius
    let bB = b.y + b.radius

    return bR > pcL && bT < pcB && bL < pcR && bB > pcT
}

function cdcall() {
    if (collision(ball, pc)) {
        ball.velX = -ball.velX
    }

    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;

        // change the X and Y velocity direction
        ball.velX = -(ball.speed * Math.cos(angleRad));
        ball.velY = ball.speed * Math.sin(angleRad);

        ball.speed += 1;
        pc.speed += 0.5
    }
}

// reset the ball when u figure out how to detect if ball is not hitting the paddles
function resetGame() {
    pc.speed = 15
    ball.speed = 7
    ball.velX = 5
    ball.velY = 5
    ball.x = canvas.width / 2
    ball.y = canvas.height / 2
}

// point system
function points() {

    let pcPoint = ball.x - ball.radius < 0
    let playerPoint = ball.x + ball.width > canvas.width

    if (pcPoint) {
        pc.pcScoreTracker++
        pcScore.textContent = pc.pcScoreTracker
        resetGame()
    } else if (playerPoint) {
        player.playerScoreTracker++
        playerScore.textContent = player.playerScoreTracker
        resetGame()
    }
}


// update Game
function update() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // player
    player.draw()

    // pc
    pc.draw()
    pc.move()

    // ball
    ball.draw()
    ball.move()

    // Game
    cdcall()
    points()
    net.draw()

    requestAnimationFrame(update)
}

update()