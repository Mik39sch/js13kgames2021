import { GameLoop, bindKeys, initKeys, loadImage, imageAssets, setImagePath } from 'kontra';
import { score, startTime, obstacleMoveSpeed, beforeTime, now, bestTimeText, playerMoveSpeed, bestTime, bestScoreText, bestScore } from './global';
import { hitSound, countupSound, startSound, getSound } from './sound'
import { getTime } from './util';
import { background } from './bkimg';
import { scoreText, renderClearWindow, renderTitle } from './texts';
import { player, createPlayer } from './player';
import { obstacle } from './obstacle';
import { items } from './items';

initKeys();
const cookies = document.cookie.split(";");
for (let cookie of cookies) {
    const cArray = cookie.split("=");
    if (cArray[0].trim() === 'time') {
        bestTime = cArray[1];
        bestTimeText = `[Best Time] ${getTime(bestTime)}`;
    }
    if (cArray[0].trim() === 'score') {
        bestScore = cArray[1];
        bestScoreText = `[Best Score] ${bestScore}`;
    }
}

setImagePath('./assets/images');
loadImage('player.png').then(function() {
    player = createPlayer(imageAssets['player']);

    const initialize = () => {
        startSound();
        startTime = new Date();
        obstacleMoveSpeed = 1;
        beforeTime = 0;
        score = 0;
        obstacle.obstacles = [];
        items.items = [];
        now = undefined;
        if (player) {
            player.x = 100;
            player.y = 150;
        }

        if (scoreText) {
            scoreText.text = `${bestTimeText} ${bestScoreText}\nTime: 0.00\n Score: 0`;
        }
    };

    const game = GameLoop({
        update: function(dt) {
            player.update();
            obstacle.update();
            items.update();

            now = new Date();
            const ms = now.getTime() - startTime.getTime();
            const s = Math.floor(ms / 1000);

            scoreText.text = `${bestTimeText}, ${bestScoreText}\nTime: ${getTime(ms)}\n Score: ${score}`;

            if (beforeTime != s) {
                beforeTime = s;
                if (s % 5 === 0) {
                    obstacleMoveSpeed += 0.2;
                    playerMoveSpeed += 0.1;
                    countupSound();
                }
            }

            let getItem;
            items.items.forEach(item => {
                const adjustNum = 10;
                if (
                    player.x + adjustNum >= item.x - item.radius / 2&&
                    player.x - adjustNum <= item.x + item.radius / 2 &&
                    player.y + adjustNum >= item.y - item.radius / 2 &&
                    player.y - adjustNum <= item.y + item.radius / 2
                ) {
                    getSound();
                    getItem = item;
                    score += item.radius;
                    return;
                }
            });

            if (getItem) {
                items.items = items.items.filter(item => item !== getItem);
            }

            obstacle.obstacles.forEach(obstacle => {
                const adjustNum = 5;
                if (
                    player.x + adjustNum >= obstacle.x &&
                    player.x - adjustNum <= obstacle.x + obstacle.width &&
                    player.y + adjustNum >= obstacle.y &&
                    player.y - adjustNum <= obstacle.y + obstacle.height
                ) {
                    hitSound();
                    game.stop();
                    return;
                }
            });
        },
        render: function() {
            if (game.isStopped) {
                renderClearWindow();
                return;
            }

            background.render();
            player.render();

            items.items.forEach(item => item.render());
            obstacle.obstacles.forEach(obstacle => obstacle.render());

            scoreText.render();
        }
    });

    bindKeys('space', () => {
        if (game.isStopped) {
            initialize();
            game.start();
        }
    }, 'keyup');

    background.defineStars();
    renderTitle();
});