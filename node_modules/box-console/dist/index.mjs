import stringWidth from 'string-width';
import chalk from 'chalk';

const boxConsole = function (messages) {
    let tips = [];
    let maxLen = 0;
    let defaultSpace = 4;
    let spaceWidth = stringWidth(' ');
    let borderSpace = stringWidth('│');
    if (Array.isArray(messages)) {
        tips = Array.from(messages);
    }
    else {
        tips = [messages];
    }
    tips = [' ', ...tips, ' '];
    tips = tips.map((msg) => ({ val: msg, len: stringWidth(msg) }));
    maxLen = tips.reduce((maxLen, tip) => {
        maxLen = Math.max(maxLen, tip.len);
        return maxLen;
    }, maxLen);
    maxLen += spaceWidth * 2 * defaultSpace;
    tips = tips.map(({ val, len }) => {
        let i = 0;
        let j = 0;
        while (len + i * 2 * spaceWidth < maxLen) {
            i++;
        }
        j = i;
        while (j > 0 && len + i * spaceWidth + j * spaceWidth > maxLen) {
            j--;
        }
        return ' '.repeat(i) + val + ' '.repeat(j);
    });
    let line = chalk.yellow('─'.repeat(maxLen));
    console.log(chalk.yellow('┌') + line + chalk.yellow('┐'));
    for (let msg of tips) {
        console.log(chalk.yellow('│') + msg + chalk.yellow('│'));
    }
    console.log(chalk.yellow('└') + line + chalk.yellow('┘'));
};

export default boxConsole;
