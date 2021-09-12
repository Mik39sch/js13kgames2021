import { GameLoop, bindKeys, initKeys } from 'kontra';
import { startTime,
    obstacleMoveSpeed,
    beforeTime,
    now,
    bestScoreText,
    playerMoveSpeed,
    bestScore } from './global';
import { hitSound, countupSound, startSound } from './sound'
import { getTime } from './util';
import { background } from './bkimg';
import { scoreText, renderClearWindow, renderTitle } from './texts';
import { player, createPlayer } from './player';
import { obstacle } from './obstacle';

// initialize ------------------------
initKeys();
const cookies = document.cookie.split(";");
for (let cookie of cookies) {
    const cArray = cookie.split("=");
    if (cArray[0] === 'score') {
        bestScore = cArray[1];
        bestScoreText = `[BEST] ${getTime(bestScore)}`;
        break;
    }
}

const image = new Image();
image.src = 'assets/images/player.png';
image.onload = function() {
    player = createPlayer(image);

    const initialize = () => {
        startSound();
        startTime = new Date();
        obstacleMoveSpeed = 1;
        beforeTime = 0;
        obstacle.obstacles = [];
        now = undefined;
        if (player) {
            player.x = 100;
            player.y = 150;
        }

        if (scoreText) {
            scoreText.text = `${bestScoreText}\n0:00`;
        }
    };

    const game = GameLoop({
        update: function(dt) {
            player.update();
            obstacle.update();

            now = new Date();
            const ms = now.getTime() - startTime.getTime();
            const s = Math.floor(ms / 1000);

            scoreText.text = `${bestScoreText}\n${getTime(ms)}`;

            if (beforeTime != s) {
                beforeTime = s;
                if (s % 5 === 0) {
                    obstacleMoveSpeed += 0.2;
                    playerMoveSpeed += 0.1;
                    countupSound();
                }
            }

            if (obstacle.obstacles.length > 0) {
                obstacle.obstacles.forEach(obstacle => {
                    if (
                        player.x >= obstacle.x && player.x <= obstacle.x + obstacle.width &&
                        player.y >= obstacle.y && player.y <= obstacle.y + obstacle.height
                    ) {
                        hitSound();
                        game.stop();
                        return;
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

            obstacle.obstacles.forEach(obstacle => obstacle.render());
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
};