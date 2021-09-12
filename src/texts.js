import { Text } from "kontra";
import { now, startTime, score } from "./global";
import { STRING_COLOR } from "./constants";
import { background } from "./bkimg";
import { setCookie, getTime } from "./util";

const baseTextObject = {
    font: '32px Arial',
    color: STRING_COLOR,
    x: 5,
};

export const scoreText = Text({
    ...baseTextObject,
    text: "0.00",
    font: '16px Arial',
    y: 5,
});

export const renderClearWindow = () => {
    const ms = now.getTime() - startTime.getTime();
    const newRecord = setCookie(ms, score);

    const resultText = Text({
        ...baseTextObject,
        text: newRecord.some(rec => rec) ? '!!! NEW RECORD !!!\n' : 'GAME OVER!!!\n\n',
        y: 30,
        color: newRecord.some(rec => rec) ? 'red' : 'gold',
    });
    const timeText = Text({
        ...baseTextObject,
        text: `Time: ${getTime(ms)}`,
        y: 60,
        color: newRecord[0] ? 'red' : 'gold',
    });
    const scoreText = Text({
        ...baseTextObject,
        text: `Score: ${score}\n`,
        y: 90,
        color: newRecord[1] ? 'red' : 'gold',
    });
    const nextText = Text({
        ...baseTextObject,
        text: 'Hit [SPACE] to restart!',
        y: 120,
    });

    background.render();
    resultText.render();
    timeText.render();
    scoreText.render();
    nextText.render();
};

export const renderTitle = () => {
    const text = Text({
        text: 'SPACES IN SPACE\n\nHit [SPACE] to start!!!',
        y: 70,
        ...baseTextObject
    });

    background.render();
    text.render();
};
