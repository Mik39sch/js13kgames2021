import { bestScore, bestScoreText } from './global';

const getTime = time => ('' + ((time | 0) / 1000)).replace('.', ':');

const setBestScore = score => {
    if (score >= bestScore) {
        bestScore = score;
        bestScoreText = `[BEST] ${getTime(bestScore)}`;
        document.cookie = `score=${score}`;
        return true;
    }
    return false;
};

export { getTime, setBestScore };
