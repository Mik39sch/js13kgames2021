import { init, GameLoop, Sprite, SpriteSheet, keyPressed, initKeys, Text } from 'kontra';

let { canvas, context } = init();
initKeys();

// constant ---------------------------------------------------------
const PLAYER_HEIGHT = 97;
const PLAYER_WIDTH = 72;
const LOAD_PADDING = 3;

const STAGE_WIDTH = canvas.width;
const STAGE_HEIGHT = canvas.height;

const Y_LOAD_WIDTH = PLAYER_HEIGHT + LOAD_PADDING;
const X_LOAD_WIDTH = PLAYER_WIDTH + LOAD_PADDING;

const MOVE_SPEED = 2;

// ------------------------------------------------------------------

const startTime = new Date();

let image = new Image();
image.src = 'assets/images/player.png';

const rand = (max, min) => {
    return Math.floor( Math.random() * (max + 1 - min) ) + min ;
}

const getTime = (time) =>
    ('' + ((time | 0) / 1000)).replace('.', ':');


image.onload = function() {
    const player = Sprite({
        x: 100,
        y: 150,
        scaleX: 0.5,
        scaleY: 0.5,
        image: image,
        anchor: {x: 0.5, y: 0.5},
    });

    let background = {
        stars: [],
        defineStars: function () {
            for (let i = 0; i < 70; i++) {
                this.stars.push([rand(0, STAGE_WIDTH), rand(0, STAGE_HEIGHT), rand(1, 3)]);
            }
        },
        render: function () {
            context.save()
            context.beginPath();
            context.rect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
            context.fillStyle = "rgba(8, 6, 51, 1)";
            context.fill();
            context.closePath();

            this.stars.forEach(star => {
                context.beginPath();
                context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                context.arc(star[0], star[1], star[2], 0, 2 * Math.PI);
                context.fill();
            });

            context.restore();
        }
    }

    const obstacles = [];

    const createObstacle = () => {
        const above = (rand(0, 1000) % 2 === 0);
        const x = STAGE_WIDTH;
        const y = above ? 0 : rand(Y_LOAD_WIDTH, STAGE_HEIGHT/2);
        const width = 10;
        const height = above ? rand(STAGE_HEIGHT/2, STAGE_HEIGHT-Y_LOAD_WIDTH) : STAGE_HEIGHT - y;
        const color = 'gray';

        const nextWidth = rand(X_LOAD_WIDTH, X_LOAD_WIDTH*4);

        obstacles.push(Sprite({x, y, width, height, color, above, nextWidth}));
    };

    createObstacle();

    let obstacleMoveSpeed = 1;
    let beforeTime = 0;

    let loop = GameLoop({
        update: function(dt) {
            player.update();
            if (obstacles.length > 0) {
                obstacles.forEach(obstacle => obstacle.update());
            }
            if (keyPressed('left')) {
                player.dx = - MOVE_SPEED;
            } else if (keyPressed('right')) {
                player.dx = MOVE_SPEED;
            }

            if (keyPressed('up')) {
                player.dy = - MOVE_SPEED;
            } else if (keyPressed('down')) {
                player.dy = MOVE_SPEED;
            }

            if (
                !keyPressed('left') && !keyPressed('right') &&
                !keyPressed('up') && !keyPressed('down')
            ) {
                player.dx = 0;
                player.dy = 0;
            }

            if (player.x >= STAGE_WIDTH) {
                player.x = STAGE_WIDTH;
            } else if (player.x <= 0) {
                player.x = 0;
            }

            if (player.y > STAGE_HEIGHT) {
                player.y = STAGE_HEIGHT;
            } else if (player.y <= 0) {
                player.y = 0;
            }

            if (obstacles.length > 0) {
                obstacles.map(obstacle => obstacle.dx = - obstacleMoveSpeed).filter(obstacle => obstacle.x > 0);
                if (obstacles[obstacles.length - 1].x < STAGE_WIDTH - obstacles[obstacles.length - 1].nextWidth) {
                    createObstacle();
                }
            }

            const now = new Date();
            const ms = now.getTime() - startTime.getTime();
            const s = Math.floor(ms / 1000);

            const displayTime = getTime(ms);

            if (beforeTime != s) {
                beforeTime = s;
                if (s % 5 === 0) obstacleMoveSpeed += 0.2;
            }

            if (obstacles.length > 0) {
                obstacles.forEach(obstacle => {
                    if (
                        player.x >= obstacle.x && player.x <= obstacle.x + obstacle.width &&
                        player.y >= obstacle.y && player.y <= obstacle.y + obstacle.height
                    ) {
                        console.log("Game Over X");
                        return;
                    }
                });
            }
        },
        render: function() {
            background.render();
            player.render();

            if (obstacles.length > 0) {
                obstacles.forEach(obstacle => obstacle.render());
            }
        }
    });

    background.defineStars();
    loop.start();
};