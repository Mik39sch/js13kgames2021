import { Sprite, randInt } from "kontra";
import { STAGE_WIDTH, STAGE_HEIGHT, Y_LOAD_WIDTH, X_LOAD_WIDTH } from "./constants";
import { obstacleMoveSpeed } from "./global";

export const obstacle = {
    objs: [],
    createObstacle: function() {
        const above = (randInt(0, 1000) % 2 === 0);
        const x = STAGE_WIDTH;
        const y = above ? 0 : randInt(Y_LOAD_WIDTH, STAGE_HEIGHT/2);
        const width = 10;
        const height = above ? randInt(STAGE_HEIGHT/2, STAGE_HEIGHT-Y_LOAD_WIDTH) : STAGE_HEIGHT - y;
        const color = 'gray';

        const nW = randInt(X_LOAD_WIDTH, X_LOAD_WIDTH*4);

        this.objs.push(Sprite({x, y, width, height, color, above, nW}));
    },
    update: function () {
        let len = this.objs.length;
        if (len > 0) {
            this.objs.forEach(obstacle => obstacle.update());
            this.objs.map(obstacle => obstacle.dx = - obstacleMoveSpeed).filter(obstacle => obstacle.x > 0);
            len = this.objs.length;
        }

        if (len === 0 || this.objs[len - 1].x < STAGE_WIDTH - this.objs[len - 1].nW) {
            this.createObstacle();
        }
    }
};
