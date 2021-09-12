import { Text } from "kontra";
import { now, startTime } from "./global";
import { STRING_COLOR } from "./constants";
import { background } from "./bkimg";
import { setBestScore, getTime } from "./util";

const baseTextObject = {
    font: '32px Arial',
    color: STRING_COLOR,
    x: 5,
};

export const scoreText = Text({
    text: "0.00",
    font: '24px Arial',
    y: 5,
    ...baseTextObject
});

export const renderClearWindow = () => {
    const ms = now.getTime() - startTime.getTime();
    const newRecord = setBestScore(ms);

    let msg = newRecord ? '!!! NEW RECORD !!!\n' : 'GAME OVER!!!\n';
    msg += `Your score is ${getTime(ms)}\n\n`;
    msg += 'Hit [SPACE] to restart!';

    const clearText = Text({
        text: msg,
        y: 70,
        ...baseTextObject
    });

    background.render();
    clearText.render();
};

export const renderTitle = () => {
    const text = Text({
        text: 'Hit [SPACE] to start!!!',
        y: 100,
        ...baseTextObject
    });

    background.render();
    text.render();
};
