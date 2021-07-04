import * as config from "./config/define.js";

console.log(config.APP_TITLE);

const canvas = document.querySelector("canvas");
canvas.width = config.CANVAS_WIDTH;
canvas.height = config.CANVAS_HEIGHT;

const ctx = canvas.getContext('2d');

for (let x = 0; x < config.STAGE_WIDTH; x++) {
    for (let y = 0; y < config.STAGE_HEIGHT; y++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? 'gray' : 'black';
        ctx.fillRect(x * config.PIXEL_SIZE, y * config.PIXEL_SIZE, config.PIXEL_SIZE, config.PIXEL_SIZE);
    }
}

const character = [
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0,],
    [0, 0, 0, 1, 2, 2, 1, 0, 0, 0,],
    [0, 0, 0, 1, 2, 2, 1, 0, 0, 0,],
    [0, 0, 0, 1, 2, 2, 1, 0, 0, 0,],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0,],
    [0, 0, 1, 2, 2, 2, 2, 1, 0, 0,],
    [0, 0, 1, 2, 2, 2, 2, 1, 0, 0,],
    [0, 0, 1, 2, 2, 2, 2, 1, 0, 0,],
    [0, 0, 1, 2, 1, 1, 2, 1, 0, 0,],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 0,],
];

let character_x = 15;
let character_y = 15;

for (let y = 0; y < character.length; y++) {
    const character_h = character[y];
    for (let x = 0; x < character_h.length; x++) {
        const color = character_h[x];
        if (color === 0) {
            continue;
        }
        ctx.fillStyle = color === 1 ? 'red' : 'white';
        ctx.fillRect(
            x * config.PIXEL_SIZE + character_x,
            y * config.PIXEL_SIZE + character_y,
            config.PIXEL_SIZE,
            config.PIXEL_SIZE
        );
    }
}