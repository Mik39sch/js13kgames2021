import { init, Sprite, SpriteSheet, GameLoop } from 'kontra';

let { canvas } = init();

// let sprite = Sprite({
//   x: 100,        // starting x,y position of the sprite
//   y: 80,
//   color: 'red',  // fill color of the sprite rectangle
//   width: 20,     // width and height of the sprite rectangle
//   height: 40,
//   dx: 2          // move the sprite 2px to the right every frame
// });


let image = new Image();
image.src = 'assets/imgs/character_walk_sheet.png';
image.onload = function() {
  let spriteSheet = SpriteSheet({
    image: image,
    frameWidth: 72,
    frameHeight: 97,
    animations: {
      idle: {
        frames: 1
      },
      // create a named animation: walk
      walk1: {
        frames: '0..9',  // frames 0 through 9
        frameRate: 30
      },
      jump: {
        // sequence of frames (can be non-consecutive)
        frames: [1, 10, 1],
        frameRate: 10,
        // loop: false,
      },
      walk2: {
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
        // loop: false,
      }
    }
  });

  let sprite = Sprite({
    x: 100,
    y: 80,

    // use the sprite sheet animations for the sprite
    animations: spriteSheet.animations
  });

  // use kontra.gameLoop to play the animation
  let loop = GameLoop({
    update: function(dt) {
      sprite.update();
      debugger;
      if (sprite.x > canvas.width) {
        sprite.x = -sprite.width;
      }
    },
    render: function() {
      sprite.render();
    }
  });

  loop.start();

};


// let loop = GameLoop({  // create the main game loop
//   update: function() { // update the game state
//     sprite.update();

//     // wrap the sprites position when it reaches
//     // the edge of the screen
//     if (sprite.x > canvas.width) {
//       sprite.x = -sprite.width;
//     }
//   },
//   render: function() { // render the game state
//     sprite.render();
//   }
// });

// loop.start();    // start the game