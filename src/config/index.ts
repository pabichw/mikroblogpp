import { EMOJIS } from './emojis';

const EMOJI_PROMPT: string = "::";
const PROMO_PROMPT_START: string = "[[";
const PROMO_PROMPT_END: string = "]]";
const PROMO_CONTENT: string = `${PROMO_PROMPT_START}_Uwaga! Wiadomość zawiera treść dostępną tylko dla użytkowników Mikroblog++. Aby uzyskac dostęp [pobierz wtyczkę](https://chrome.google.com/webstore/detail/mikroblog%20%20/kghikmoknnlipljafghjmlnjedjhpcka)_${PROMO_PROMPT_END}`

const LS_KEYS = {
    CONFIG: 'MPP_CONFIG'
}

export {
    EMOJIS,
    EMOJI_PROMPT,
    LS_KEYS,
    PROMO_PROMPT_START,
    PROMO_PROMPT_END,
    PROMO_CONTENT
}