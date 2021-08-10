import { init, GameLoop, Sprite, SpriteSheet, keyPressed, initKeys, bindKeys } from 'kontra';

let { canvas } = init();
initKeys();

const startTime = new Date();

let image = new Image();
image.src = 'assets/imgs/character_walk_sheet.png';

image.onload = function() {

    let spriteSheet = SpriteSheet({
        image: image,
        frameWidth: 72,
        frameHeight: 97,

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
        x: 200,
        y: 400,

        scaleX: 0.5,
        scaleY: 0.5,

        anchor: {x: 0.5, y: 0.5},
        // rotation: 50,
        // scaleX: -sprite.frameWidth,

        // use the sprite sheet animations for the sprite
        animations: spriteSheet.animations
    });

    let enemy = Sprite({
        x: 0, y:0,
        width: 10, height: 10,
        color: 'red'
    });

    let loop = GameLoop({
        update: function(dt) {
            player.update();
            enemy.update();
            if (keyPressed('left')) {
                player.dx = -1;
                player.playAnimation("walk");
            } else if (keyPressed('right')) {
                player.dx = 1;
                player.playAnimation("walk");
            }

            if (keyPressed('up')) {
                player.dy = -1;
                player.playAnimation("walk");
            } else if (keyPressed('down')) {
                player.dy = 1;
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

            if (player.x > canvas.width) {
                player.x = 1;
            }

            if (player.x <= 0) {
                player.x = canvas.width;
            }

            const dx = (player.x - enemy.x)|0;
            const dy = (player.y - enemy.y)|0;
            if (Math.abs(dx) >= Math.abs(dy)) {
                enemy.dx = dx / Math.abs(dx) / 2;
                enemy.dy = 0;
            } else {
                enemy.dy = dy / Math.abs(dy) / 2;
                enemy.dx = 0;
            }
        },
        render: function() {
            player.render();
            enemy.render();
        }
    });

    loop.start();
};