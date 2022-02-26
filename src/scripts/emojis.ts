import EmojiMenu from '../components/EmojiMenu.svelte';

import { EMOJIS, EMOJI_PROMPT } from '../config';

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

    // buttonElem.insertBefore(emojiMenuElem, buttonElem.firstChild);
}

const setup = () => {
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

export {
    setup
}