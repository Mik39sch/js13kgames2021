import { randInt } from "kontra";
import { context } from "./global";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";

export const background = {
    stars: [],
    defineStars: function () {
        for (let i = 0; i < 70; i++) {
            this.stars.push([randInt(0, STAGE_WIDTH), randInt(0, STAGE_HEIGHT), randInt(1, 3)]);
        }
    },
    render: function () {
        context.save()
        context.beginPath();
        context.rect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
        context.fillStyle = "rgba(8, 6, 51, 1)";
        context.fill();
        context.closePath();

        this.stars.forEach(star => {
            context.beginPath();
            context.fillStyle = 'rgba(255, 255, 255, 0.8)';
            context.arc(star[0], star[1], star[2], 0, 2 * Math.PI);
            context.fill();
        });

        context.restore();
    }
};