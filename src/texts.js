import { Text } from "kontra";
import { now, startTime, score, bestScore } from "./global";
import { STRING_COLOR } from "./constants";
import { background } from "./bkimg";
import { setCookie, getTime } from "./util";

const baseTextObject = {
    font: '32px Arial',
    color: STRING_COLOR,
    x: 5,
};

export const explainText = Text({
    ...baseTextObject,
    text: 'Try to get as much stars as you can!\nBe careful not to hit the walls.',
    y: 70
})

export const scoreText = Text({
    ...baseTextObject,
    text: "0.00",
    font: '16px Arial',
    y: 5,
});

export const renderClearWindow = () => {
    const ms = now.getTime() - startTime.getTime();
    const newRecord = setCookie(ms, score);

    const lineObj = {...baseTextObject, text: "==============",}

    const line1 = Text({...lineObj, y:10});
    const resultText = Text({
        ...baseTextObject,
        text: newRecord.some(rec => rec) ? 'NEW RECORD !!!' : 'GAME OVER!',
        y: 40,
        color: '#00FF00',
    });
    const line2 = Text({...lineObj, y:70});

    const scoreText = Text({
        ...baseTextObject,
        text: `Score: ${score}\nBest Score: ${bestScore}`,
        y: 100,
        color: newRecord[1] ? 'red' : 'gold',
    });
    const nextText = Text({
        ...baseTextObject,
        text: 'Hit [SPACE] to try again!',
        y: 180,
    });

    background.render();

    line1.render();
    resultText.render();
    line2.render();
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
