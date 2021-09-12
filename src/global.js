import { init } from 'kontra';

export let startTime = new Date();
export let obstacleMoveSpeed = 1;
export let beforeTime = 0;
export let now;
export let bestScore = 0;
export let bestScoreText = '[BEST] 0.00';
export let playerMoveSpeed = 2;
export let canvas;
export let context;

if (!canvas) {
    ({ canvas, context } = init());
    let stageWidth = window.innerWidth;
    canvas.width = stageWidth < 900 ? stageWidth : 900;
}
