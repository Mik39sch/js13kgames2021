import { init, GameLoop, Sprite, bindKeys, keyPressed, initKeys, Text, unbindKeys, randInt } from 'kontra';
import { zzfx } from 'zzfx';

// const hitSound = zzfx(...[1.4,,459,,.04,.07,4,.07,-8.3,-6.7,,,,.9,,.3,.03,.67,.1,.07]); // Hit 1
// const countupSound = zzfx(...[1.12,,588,.09,.35,.34,,.04,,-0.1,-3,.02,.16,,18,,,.69,.01,.08]); // Powerup 13

let { canvas, context } = init();
let stageWidth = window.innerWidth;
canvas.width = stageWidth < 900 ? stageWidth : 900;
initKeys();

// constant ---------------------------------------------------------
const PLAYER_HEIGHT = 97;
const PLAYER_WIDTH = 72;
const LOAD_PADDING = 3;

const STAGE_WIDTH = canvas.width;
const STAGE_HEIGHT = canvas.height;

const Y_LOAD_WIDTH = PLAYER_HEIGHT + LOAD_PADDING;
const X_LOAD_WIDTH = PLAYER_WIDTH + LOAD_PADDING;

const STRING_COLOR = "gold";

const MOVE_SPEED = 2;
// ------------------------------------------------------------------

// global -----------------------------------------------------------
let startTime = new Date();
let obstacles = [];
let obstacleMoveSpeed = 1;
let beforeTime = 0;
let now;
// ------------------------------------------------------------------
const image = new Image();
image.src = 'assets/images/player.png';

const getTime = (time) =>
    ('' + ((time | 0) / 1000)).replace('.', ':');

image.onload = function() {
    // player
    const player = Sprite({
        x: 100,
        y: 150,
        scaleX: 0.5,
        scaleY: 0.5,
        image: image,
        anchor: {x: 0.5, y: 0.5},
    });

    const scoreText = Text({
        text: "0.00",
        font: '24px Arial',
        color: STRING_COLOR,
        x: 5,
        y: 5,
    });

    const initialize = () => {
        startTime = new Date();
        obstacleMoveSpeed = 1;
        beforeTime = 0;
        obstacles = [];
        now = undefined;
        if (player) {
            player.x = 100;
            player.y = 150;
        }

        if (scoreText) {
            scoreText.text = "0.00";
        }
    };

    const background = {
        stars: [],
        defineStars: function () {
            for (let i = 0; i < 70; i++) {
                this.stars.push([randInt(0, STAGE_WIDTH), randInt(0, STAGE_HEIGHT), randInt(1, 3)]);
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

    const createObstacle = () => {
        const above = (randInt(0, 1000) % 2 === 0);
        const x = STAGE_WIDTH;
        const y = above ? 0 : randInt(Y_LOAD_WIDTH, STAGE_HEIGHT/2);
        const width = 10;
        const height = above ? randInt(STAGE_HEIGHT/2, STAGE_HEIGHT-Y_LOAD_WIDTH) : STAGE_HEIGHT - y;
        const color = 'gray';

        const nextWidth = randInt(X_LOAD_WIDTH, X_LOAD_WIDTH*4);

        obstacles.push(Sprite({x, y, width, height, color, above, nextWidth}));
    };

    const game = GameLoop({
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

            if (obstacles.length === 0) {
                createObstacle();
            } else {
                obstacles.map(obstacle => obstacle.dx = - obstacleMoveSpeed).filter(obstacle => obstacle.x > 0);
                if (obstacles[obstacles.length - 1].x < STAGE_WIDTH - obstacles[obstacles.length - 1].nextWidth) {
                    createObstacle();
                }
            }

            now = new Date();
            const ms = now.getTime() - startTime.getTime();
            const s = Math.floor(ms / 1000);

            scoreText.text = getTime(ms);

            if (beforeTime != s) {
                beforeTime = s;
                if (s % 5 === 0) {
                    obstacleMoveSpeed += 0.2;
                    // countupSound();
                };
            }

            if (obstacles.length > 0) {
                obstacles.forEach(obstacle => {
                    if (
                        player.x >= obstacle.x && player.x <= obstacle.x + obstacle.width &&
                        player.y >= obstacle.y && player.y <= obstacle.y + obstacle.height
                    ) {
                        // hitSound();
                        game.stop();
                    }
                });
            }
        },
        render: function() {
            if (game.isStopped) {
                renderClearWindow();
                return;
            }

            background.render();
            player.render();
            scoreText.render();

            if (obstacles.length > 0) {
                obstacles.forEach(obstacle => obstacle.render());
            }
        }
    });

    const renderClearWindow = () => {
        const ms = now.getTime() - startTime.getTime();

        const clearText = Text({
            text: ` Game Over!!\n Your score is ${getTime(ms)}\n\n You can restart if you push [SPACE] key!`,
            font: '32px Arial',
            color: STRING_COLOR,
            x: 0,
            y: 70,
        });

        background.render();
        clearText.render();
    };

    const renderTitle = () => {
        const text = Text({
            text: ' Hello Everyone!\n You can start if you push [SPACE] key!',
            font: '32px Arial',
            color: STRING_COLOR,
            x: 0,
            y: 100,
        });

        background.render();
        text.render();
    };

    bindKeys('space', () => {
        if (game.isStopped) {
            initialize();
            game.start();
        }
    }, 'keyup');

    background.defineStars();
    renderTitle();
};