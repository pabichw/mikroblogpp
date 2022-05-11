import EmojiMenu from '../components/EmojiMenu.svelte';

import { EMOJIS, EMOJI_PROMPT, LS_KEYS, PROMO_PROMPT_START, PROMO_PROMPT_END, PROMO_CONTENT } from '../config';

interface Config {
    ALLOW_PROMO: boolean
}

let CONFIG: Config

const replaceTagsWithEmojis = (): void => {
    const textNodes = document.querySelectorAll(`.text p`);

    textNodes.forEach(textNode => {
        let newHtml = textNode.innerHTML;
        Object.keys(EMOJIS).forEach(key => {
            newHtml = newHtml.replaceAll(`${EMOJI_PROMPT}${key}`, () => buildEmoji(key));;
        })
        textNode.innerHTML = newHtml;
    })
}

const buildEmoji = (emoji): string => {
    return (`
        <span class="mbpp-emoji">
            <img src=${chrome.runtime.getURL(EMOJIS[emoji].asset)} alt="${emoji}" title="${emoji}" />
        </span>
    `)
} 

const injectEmojisMenu = (formElem) => {
    const existingMenuHandler = formElem.querySelector('.mordzia-emojiMenu');
    if (existingMenuHandler) {
        existingMenuHandler.remove() // remove existing menus
    }

    const buttonElem = formElem.querySelector('fieldset.buttons');

    new EmojiMenu({
        target: buttonElem,
        anchor: buttonElem.firstChild
    });
}

const hidePromoTrash = (): void => 
    Array.from(document.querySelectorAll('#itemsStream li .text'))
        .forEach(text => 
            text.innerHTML = text.innerHTML.replace(/(?=\[\[)(.*)(?<=\]\])/gi, '') // TODO: USE PROMPTS
        )

const initConfig = (): void => {
    CONFIG = {
        ALLOW_PROMO: getConfig()?.ALLOW_PROMO !== undefined ? getConfig().ALLOW_PROMO : true
    }
}

const setConfig = (field, value) => {
    CONFIG[field] = value;
    localStorage.setItem(LS_KEYS.CONFIG, JSON.stringify(CONFIG));
}

const getConfig = (): Config => JSON.parse(localStorage.getItem(LS_KEYS.CONFIG)) as Config;

const initEmojis = () => {
    const formElem = document.querySelector('form[data-submitflag="commentSubmit"]') || document.querySelector('form[data-submitflag="pmSubmit"]');

    replaceTagsWithEmojis();
    injectEmojisMenu(formElem);

    const btnReply = document.querySelectorAll('.btnReply')
    btnReply.forEach(btn => btn.addEventListener('click', () => 
        setTimeout(() => { 
            const forms = document.querySelectorAll('form[data-submitflag="commentSubmit"]')
            forms.forEach(form => injectEmojisMenu(form))
        }, 100)
    ));

    setInterval(replaceTagsWithEmojis, 2000);
}

const initPromo = async (): Promise<void> => {
    const commentSubmitBtn: HTMLFormElement = document.querySelector('#commentForm .gaSubmit_stream') || document.querySelector('#commentForm .gaSubmit_profile') || document.querySelector('#commentForm .gaSubmit_mywykop') || document.querySelector('#commentForm .gaSubmit_entries');
    const formActions: HTMLElement = document.querySelector('#commentForm .mfUploadHolder');
    const row: HTMLDivElement = document.createElement('div');
    const input: HTMLInputElement = document.createElement('input');
    const label: HTMLLabelElement = document.createElement('label');

    commentSubmitBtn.addEventListener('click', async (e: SubmitEvent): Promise<any> => {
        if (!CONFIG.ALLOW_PROMO) {
            return
        }

        const textArea: HTMLTextAreaElement = document.querySelector('#commentForm textarea');
        textArea.value += `\n\n${PROMO_CONTENT}`
    })

    row.className= 'row';

    input.id = 'mpp-promo-checkbox';
    input.className = 'checkbox';
    input.type="checkbox";
    input.checked = CONFIG.ALLOW_PROMO;
    input.onchange = (e) => {
        setConfig('ALLOW_PROMO', e.target.checked)
    }

    label.className = 'inline';
    label.htmlFor = 'mpp-promo-checkbox';
    label.innerText = 'Pomóż promować Mikroblog++';
    
    row.appendChild(input);
    row.appendChild(label);
    formActions.appendChild(row);
    
    hidePromoTrash();
}

const setup = (): void => {
    initConfig(); // move to content_scrips

    initEmojis(); 
    initPromo(); // move to content_scripts
}

export {
    setup
}