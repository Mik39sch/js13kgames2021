import { Sprite, randInt } from "kontra";
import { STAGE_WIDTH, STAGE_HEIGHT, Y_LOAD_WIDTH, X_LOAD_WIDTH } from "./constants";
import { obstacleMoveSpeed } from "./global";

export const items = {
    items: [],
    createItem: function() {
        const x = STAGE_WIDTH;
        const y = randInt(15, STAGE_HEIGHT - 15);

        const point = randInt(1, 10);
        const num = 0.05;
        const scaleX = 0.1 + num * (10 - point);
        const scaleY = 0.1 + num * (10 - point);
        const nextWidth = randInt(X_LOAD_WIDTH, X_LOAD_WIDTH*4);

        this.items.push(Sprite({
            x, y, scaleX, scaleY, point, nextWidth, image: this.image, anchor: {x: 0.5, y: 0.5},
        }));

    },
    update: function () {
        let len = this.items.length;
        if (len > 0) {
            this.items.forEach(item => item.update());
            this.items.map(item => item.dx = - obstacleMoveSpeed).filter(item => item.x > 0);
            len = this.items.length;
        }

        if (len === 0 || this.items[len - 1].x < STAGE_WIDTH - this.items[len - 1].nextWidth) {
            this.createItem();
        }
    }
};
