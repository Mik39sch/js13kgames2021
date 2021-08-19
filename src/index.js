import { init, GameLoop, Sprite, SpriteSheet, keyPressed, initKeys, Text } from 'kontra';

let { canvas } = init();
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
image.src = 'assets/imgs/character_walk_sheet.png';

const rand = (max, min) => {
    return Math.floor( Math.random() * (max + 1 - min) ) + min ;
}

const getTime = (time) =>
    ('' + ((time | 0) / 1000)).replace('.', ':');


let creating = false;

image.onload = function() {
    let spriteSheet = SpriteSheet({
        image: image,
        frameWidth: PLAYER_WIDTH,
        frameHeight: PLAYER_HEIGHT,

        // this will also call createAnimations()
        animations: {
        // create 1 animation: idle
        idle: {
            // a single frame
            frames: 1
        },
        jump: {
            // sequence of frames (can be non-consecutive)
            frames: [1, 10, 1],
            frameRate: 10,
            loop: false,
        },
        walk: {
            // ascending consecutive frame animation (frames 2-6, inclusive)
            frames: '2..6',
            frameRate: 20
        },
        moonWalk: {
            // descending consecutive frame animation (frames 6-2, inclusive)
            frames: '6..2',
            frameRate: 20
        },
        attack: {
            // you can also mix and match, in this case frames [8,9,10,13,10,9,8]
            frames: ['8..10', 13, '10..8'],
            frameRate: 10,
            loop: false,
        }
        }
    });

    let player = Sprite({
        x: 100,
        y: 150,

        scaleX: 0.5,
        scaleY: 0.5,

        anchor: {x: 0.5, y: 0.5},
        animations: spriteSheet.animations
    });

    let text = Text({
        text: '0',
        font: '24px Arial',
        color: 'red',
        x: 2,
        y: 2,
        textAlign: 'center'
      });

    const obstacles = [];

    const createObstacle = () => {
        const above = (rand(0, 1000) % 2 === 0);
        const x = STAGE_WIDTH;
        const y = above ? 0 : rand(Y_LOAD_WIDTH, STAGE_HEIGHT/2);
        const width = 10;
        const height = above ? rand(STAGE_HEIGHT/2, STAGE_HEIGHT-Y_LOAD_WIDTH) : STAGE_HEIGHT - y;
        const color = 'black';

        const nextWidth = rand(X_LOAD_WIDTH, X_LOAD_WIDTH*4);

        obstacles.push(Sprite({x, y, width, height, color, nextWidth}));
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
                player.playAnimation("walk");
            } else if (keyPressed('right')) {
                player.dx = MOVE_SPEED;
                player.playAnimation("walk");
            }

            if (keyPressed('up')) {
                player.dy = - MOVE_SPEED;
                player.playAnimation("walk");
            } else if (keyPressed('down')) {
                player.dy = MOVE_SPEED;
                player.playAnimation("walk");
            }

            if (
                !keyPressed('left') && !keyPressed('right') &&
                !keyPressed('up') && !keyPressed('down')
            ) {
                player.dx = 0;
                player.dy = 0;
                player.playAnimation("idle");
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
            console.log(getTime(ms));
            // const displayTime = getTime(diff);

            if (beforeTime != s) {
                beforeTime = s;
                // const scoreEl = document.getElementById("score");
                // scoreEl.innerText(s);
                // text.text = s;
                if (s % 5 === 0) obstacleMoveSpeed += 0.2;
            }
        },
        render: function() {
            player.render();

            if (obstacles.length > 0) {
                obstacles.forEach(obstacle => obstacle.render());
            }

            text.render();
        }
    });

    loop.start();
};