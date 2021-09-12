import { GameLoop, bindKeys, initKeys, load, imageAssets, setImagePath } from 'kontra';
import { score, startTime, obstacleMoveSpeed, beforeTime, now, playerMoveSpeed, bestTime, bestScoreText, bestScore } from './global';
import { hitSound, countupSound, startSound, getSound } from './sound'
import { getTime } from './util';
import { background } from './bkimg';
import { scoreText, renderClearWindow, renderTitle, explainText } from './texts';
import { player, createPlayer } from './player';
import { obstacle } from './obstacle';
import { items } from './items';

initKeys();
const cookies = document.cookie.split(";");
for (let cookie of cookies) {
    const cArray = cookie.split("=");
    if (cArray[0].trim() === 'time') {
        bestTime = cArray[1];
    }
    if (cArray[0].trim() === 'score') {
        bestScore = cArray[1];
        bestScoreText = `[Best Score] ${bestScore}`;
    }
}

let showExplain = true;

setImagePath('./assets/images');
load('player.png', 'item.png').then(function() {
    player = createPlayer(imageAssets['player']);
    items.image = imageAssets['item'];

    const initialize = () => {
        startSound();
        startTime = new Date();
        obstacleMoveSpeed = 1;
        beforeTime = 0;
        score = 0;
        obstacle.objs = [];
        items.items = [];
        now = undefined;
        if (player) {
            player.x = 100;
            player.y = 150;
        }

        if (scoreText) {
            scoreText.text = `${bestScoreText}\nTime: 0.00\nScore: 0`;
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

            scoreText.text = `${bestScoreText}\nTime: ${getTime(ms)}\nScore: ${score}`;

            if (beforeTime != s) {
                beforeTime = s;
                if (s % 5 === 0) {
                    obstacleMoveSpeed += 0.2;
                    playerMoveSpeed += 0.1;
                    countupSound();

                    if (showExplain) showExplain = false;
                }
            }

            let getItem;
            items.items.forEach(item => {
                const scale = item.scaleX / 2;
                if (
                    player.x + 10 >= item.x - item.width * scale &&
                    player.x - 10 <= item.x + item.width * scale &&
                    player.y + 10 >= item.y - item.height * scale &&
                    player.y - 10 <= item.y + item.height * scale
                ) {
                    getSound();
                    getItem = item;
                    score += item.point;
                    return;
                }
            });

            if (getItem) {
                items.items = items.items.filter(item => item !== getItem);
            }

            obstacle.objs.forEach(obstacle => {
                if (
                    player.x + 5 >= obstacle.x &&
                    player.x - 5 <= obstacle.x + obstacle.width &&
                    player.y + 5 >= obstacle.y &&
                    player.y - 5 <= obstacle.y + obstacle.height
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
            obstacle.objs.forEach(obstacle => obstacle.render());

            scoreText.render();

            if (showExplain) explainText.render();
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