import { keyPressed, Sprite } from "kontra";
import { playerMoveSpeed } from "./global";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";

export let player;
export const createPlayer = image => Sprite({
    x: 100,
    y: 150,
    scaleX: 0.5,
    scaleY: 0.5,
    image: image,
    anchor: {x: 0.5, y: 0.5},
    update: function() {
        this.advance();

        if (keyPressed('left')) this.dx = playerMoveSpeed * -1;
        if (keyPressed('right')) this.dx = playerMoveSpeed;
        if (keyPressed('up')) this.dy = playerMoveSpeed * -1;
        if (keyPressed('down')) this.dy = playerMoveSpeed;

        if (
            !keyPressed('left') && !keyPressed('right') &&
            !keyPressed('up') && !keyPressed('down')
        ) {
            this.dx = 0;
            this.dy = 0;
        }

        if (this.x >= STAGE_WIDTH) {
            this.x = STAGE_WIDTH;
        } else if (this.x <= 0) {
            this.x = 0;
        }

        if (this.y > STAGE_HEIGHT) {
            this.y = STAGE_HEIGHT;
        } else if (this.y <= 0) {
            this.y = 0;
        }
    }
});
