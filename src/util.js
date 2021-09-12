import { bestTime, bestScore, bestTimeText, bestScoreText } from './global';

const getTime = time => ('' + ((time | 0) / 1000));

const setCookie = (time, score) => {
    let newRecord = [false, false];
    if (time >= bestTime) {
        bestTime = time;
        bestTimeText = `[Best Time] ${getTime(bestTime)}`;
        newRecord[0] = true;
        document.cookie = `time=${bestTime}`;
    }

    if (score >= bestScore) {
        bestScore = score;
        bestScoreText = `[Best Score] ${bestScore}`;
        newRecord[1] = true;
        document.cookie = `score=${bestScore}`;
    }

    return newRecord;
};

export { getTime, setCookie };
