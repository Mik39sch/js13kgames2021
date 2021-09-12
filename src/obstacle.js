import { Sprite, randInt } from "kontra";
import { STAGE_WIDTH, STAGE_HEIGHT, Y_LOAD_WIDTH, X_LOAD_WIDTH } from "./constants";
import { obstacleMoveSpeed } from "./global";

export const obstacle = {
    obstacles: [],
    createObstacle: function() {
        const above = (randInt(0, 1000) % 2 === 0);
        const x = STAGE_WIDTH;
        const y = above ? 0 : randInt(Y_LOAD_WIDTH, STAGE_HEIGHT/2);
        const width = 10;
        const height = above ? randInt(STAGE_HEIGHT/2, STAGE_HEIGHT-Y_LOAD_WIDTH) : STAGE_HEIGHT - y;
        const color = 'gray';

        const nextWidth = randInt(X_LOAD_WIDTH, X_LOAD_WIDTH*4);

        this.obstacles.push(Sprite({x, y, width, height, color, above, nextWidth}));
    },
    update: function () {
        let len = this.obstacles.length;
        if (len > 0) {
            this.obstacles.forEach(obstacle => obstacle.update());
            this.obstacles.map(obstacle => obstacle.dx = - obstacleMoveSpeed).filter(obstacle => obstacle.x > 0);
            len = this.obstacles.length;
        }

        if (len === 0 || this.obstacles[len - 1].x < STAGE_WIDTH - this.obstacles[len - 1].nextWidth) {
            this.createObstacle();
        }
    }
};
