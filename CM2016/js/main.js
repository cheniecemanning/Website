var canvas = document.getElementById("canvas");
var loseLife_Sound = document.getElementById("sound1");
var hitBrick_Sound = document.getElementById("sound2");
var win_Sound = document.getElementById("sound3");
var ctx = canvas.getContext("2d");
var BRICKS_REMAINING = 16;
var LIVES = 10;
var NO_OF_BRICKS = 16;
var LEFT = 37;
var RIGHT = 39;
var BALL_INIT_X = 300;
var BALL_INIT_Y = 300;
var time = Date.now();
var BALL_SPEED = 3;

var brickLocation = [[4, 40], [84, 40], [164, 40], [244, 40], [324, 40], [404, 40], [484, 40], [564, 40],
        [4, 80], [84, 80], [164, 80], [244, 80], [324, 80], [404, 80], [484, 80], [564, 80]
                    ];

var brickIntact = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];

var brick = {
    x: 60,
    y: 30
};

var ballDirectionX;
var ballDirectionY;
var previousBallPosition = {
    x: 0,
    y: 0
};

var ball = {
    x: 300,
    y: 300,
    radius: 10
};

var MIN_X = ball.radius;
var MIN_Y = ball.radius;
var MAX_X = canvas.width;
var MAX_Y = canvas.height;

var keysDown = {};

var paddle = {
    x: 200,
    y: 465,
    width: 100,
    height: 15,
    deltax: 0,
    deltay: 0,
    speed: 2,
    colour: "#0ea5a5"
};

setInterval(run, 10);

function update() {
    'use strict';
    if (LEFT in keysDown) {
        paddle.x -= paddle.speed;
        if (paddle.x < 0) {
            paddle.x = 0;
        }
    }
    if (RIGHT in keysDown) {
        paddle.x += paddle.speed;
        if (paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
    }

}

window.addEventListener("keydown", function (e) {
    'use strict';
    keysDown[e.keyCode] = true;
});

window.addEventListener("keyup", function (e) {
    'use strict';
    delete keysDown[e.keyCode];
});

function playSound(){sound.sound1.play()}

function bricksRemaining() {
    'use strict';
    BRICKS_REMAINING--;
    sound2.play();
}

function brickCollision(brickIndex) {
    'use strict';
    if (ball.x + ball.radius < brickLocation[brickIndex][0] || ball.x - ball.radius > brickLocation[brickIndex][0] + brick.x) {
        return 0;
    }
    if (ball.y + ball.radius < brickLocation[brickIndex][1] || ball.y - ball.radius > brickLocation[brickIndex][1] + brick.y) {
        return 0;
    }
    //remove the brick
    brickIntact[brickIndex] = 0;
    ballDirectionY *= -1.0;
    bricksRemaining();
    return 1;
}

function render() {
    'use strict';
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    previousBallPosition.x = ball.x;
    previousBallPosition.y = ball.y;
    ball.x += ballDirectionX * BALL_SPEED;
    ball.y += ballDirectionY * BALL_SPEED;
    if (ball.y == previousBallPosition.y) {
        if (ball.y >= BALL_INIT_Y) {
            ball.y -= 2;
        } else {
            ball.y += 2;
        }
    }

    for (var i = 0; i < NO_OF_BRICKS; i++) {
        if (brickIntact[i] > 0) {
            if (!brickCollision(i)) {
                if (i % 3 == 0) {
                    ctx.fillStyle = "#0cdeaf";
                } else if (i % 3 == 1) {
                    ctx.fillStyle = "#8df2c1";
                } else {
                    ctx.fillStyle = "#49e5c2";
                }
            }
            ctx.fillRect(brickLocation[i][0], brickLocation[i][1], brick.x, brick.y);
        }
    }

    ctx.fillStyle = paddle.colour;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.beginPath();
    checkForPaddleCollision();
    checkForHitTheWall();
    checkForWin();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.font = "14px em";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Bricks Remaining: " + BRICKS_REMAINING, 1, 16);
    ctx.fillText("Lives Remaining: " + LIVES, 500, 16);
}

function checkForWin() {
    for (var i = 0; i < NO_OF_BRICKS; i++) {
        if (brickIntact[i] > 0) {
            
            return;
        }
    }
    
    LIVES = 10;
    BRICKS_REMAINING = 16;
    BALL_SPEED++;
    initGame();
    sound3.play();
}

function checkForHitTheWall() {
    if (ball.x < MIN_X) {
        ball.x = MIN_X;
        ballDirectionX *= -1.0;
    } else if (ball.x > MAX_X) {
        ball.x = MAX_X;
        ballDirectionX *= -1.0;
    }

    if (ball.y < MIN_Y) {
        ball.y = MIN_Y;
        ballDirectionY *= -1.0;
    } else if (ball.y >= MAX_Y) {
        ball.y = MAX_Y;
        ballDirectionY *= -1.0;
    }

    if (ball.y >= MAX_Y) {
        
        lifeLost();
    }

}


function lifeLost() {
    
    LIVES--;

    if (LIVES < 1) {
        BRICKS_REMAINING = 16;
        gameLost();
        resetLives();
    }
}

function resetLives() {
    if (LIVES < 1) {
        LIVES = 10;
    }

}

function gameLost() {
    if (LIVES < 1) {
      
        canvas.style.visibility = 'hidden';
      
     document.getElementById("restartBtn").style.display = "block";   
    } 
}

function checkForPaddleCollision() {
    if (ball.x + ball.radius < paddle.x || ball.x - ball.radius > paddle.x + paddle.width) {
        return;
    }

    if (ball.y + ball.radius < paddle.y) {
        return;
    }

    var dist = ball.x - (paddle.x + paddle.width / 2);
    ballDirectionX = 2.0 * dist / paddle.width;
    ballDirectionY *= -1.0;
    var square = Math.sqrt(ballDirectionX * ballDirectionX + ballDirectionY * ballDirectionY);
    ballDirectionX /= square;
    ballDirectionY /= square;
}



function run() {
    'use strict';
    update((Date.now() - time) / 1000);
    render();
    time = Date.now();
    
}

function initGame() {
    
    
    ballDirectionX = Math.random();
    ballDirectionY = -1.0;
    gameIntervalID = setInterval(update, 50);
    for (var i = 0; i < NO_OF_BRICKS; i++) {
        brickIntact[i] = 1;
    }
    ball.x = BALL_INIT_X;
    ball.y = BALL_INIT_Y;
   
}

function restartGame() {

document.getElementById("restartBtn").style.display = "none";
 canvas.style.visibility = 'visible';
initGame();
}

 var container = $(canvas).parent();

 $(window).resize( respondCanvas );
function respondCanvas(){
        ctx.attr('width', $(container).width() ); //max width
        ctx.attr('height', $(container).height() ); //max height

        //Call a function to redraw other content (texts, images etc)
    }
respondCanvas();
initGame();

