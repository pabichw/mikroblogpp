import { setup as setupPromo } from './scripts/promo';
import { setup as setupEmojis } from './scripts/emojis'
import { EMOJIS, LS_KEYS } from './config';

import './style/__global.scss';

export const initConfig = (): void => {
    const loadFromConfig = (field, defaultValue) => getConfig()?.[field] !== undefined ? getConfig()?.[field] : defaultValue

    localStorage.setItem(LS_KEYS.CONFIG, JSON.stringify(
        {
            ALLOW_PROMO: loadFromConfig('ALLOW_PROMO', true),
            RECENTLY_USED_EMOJIS: loadFromConfig('RECENTLY_USED_EMOJIS', Object.keys(EMOJIS).slice(0, 10))
        }
    ))
}

export const setConfig = (field, value) => {
    localStorage.setItem(LS_KEYS.CONFIG, JSON.stringify({
        ...getConfig(),
        [field]: value
    }));
}

export const getConfig = (): Config => JSON.parse(localStorage.getItem(LS_KEYS.CONFIG)) as Config;

const initScript = () => {
    initConfig()
    setupEmojis();
    setupPromo();
}

initScript();