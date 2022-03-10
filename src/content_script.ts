import { setup as setupEmojis } from './scripts/emojis'
import { EMOJIS } from './config';

import './style/__global.scss';

const loadConfig = () => {
    if (localStorage.getItem('MIKROBLOG_RECENTLY_USED_EMOJIS') === null) {
        const temp = Object.keys(EMOJIS).slice(0, 10)
        localStorage.setItem('MIKROBLOG_RECENTLY_USED_EMOJIS', JSON.stringify(temp)); // WTF?
    }
}

const initScript = () => {
    loadConfig()
    setupEmojis();
}

initScript();