import { Sprite, randInt } from "kontra";
import { STAGE_WIDTH, STAGE_HEIGHT, Y_LOAD_WIDTH, X_LOAD_WIDTH } from "./constants";
import { obstacleMoveSpeed } from "./global";

export const items = {
    items: [],
    createItem: function() {
        const x = STAGE_WIDTH;
        const y = randInt(15, STAGE_HEIGHT - 15);
        const width = 10;
        const height = 10;
        const color = 'yellow';
        const radius = randInt(1, 10);
        const render = function() {
            this.context.fillStyle = this.color;
            this.context.beginPath();
            this.context.arc(0, 0, this.radius, 0, 2  * Math.PI);
            this.context.fill();
        }

        const nextWidth = randInt(X_LOAD_WIDTH, X_LOAD_WIDTH*4);

        this.items.push(Sprite({
            x, y, width, height, color, nextWidth, radius, render
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
