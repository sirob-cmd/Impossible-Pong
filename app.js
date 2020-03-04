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
    draw: function() {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = "yellow";
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

    draw: function() {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = "red";
        context.fill();
        context.closePath();
    },

    move: function(){
        this.y = ball.y - this.height / 2
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
    draw: function() {
        context.beginPath();
        context.arc(this.x, this.y, 10, 0, Math.PI*2);
        context.fillStyle = "#0095DD";
        context.fill();
    },

    move: function(){
        this.y += this.velY
        this.x -= this.velX

        // top and bottom walls
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.velY = -this.velY;
        }
    }
}
 
// reset the ball when u figure out how to detect if ball is not hitting the paddles
function resetGame(){
    ball.speed = 7
    ball.velX= 5
    ball.velY= 5
    ball.x = canvas.width / 2
    ball.y = canvas.height / 2
}

// collision with PC
function collision(b, paddle){
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

// point system
function points(){

    let pcPoint = ball.x - ball.radius < 0
    let playerPoint = ball.x + ball.width > canvas.width

    if(pcPoint){
        pc.pcScoreTracker++
        pcScore.textContent = pc.pcScoreTracker
        resetGame()
    } else if (playerPoint){
        player.playerScoreTracker++
        playerScore.textContent = player.playerScoreTracker
        resetGame()
    }
}
   

// update Game
function update() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if(collision(ball, pc)){
        ball.velX = -ball.velX
    }

    if(collision(ball, player)){
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity direction
        ball.velX = -(ball.speed * Math.cos(angleRad));
        ball.velY = ball.speed * Math.sin(angleRad);
        
        ball.speed += 1;
    }

    // point function
    points()

    // player
    player.draw()

    // pc
    pc.draw()
    pc.move()

    // ball
    ball.draw()
    ball.move()



    requestAnimationFrame(update)
}

update()
