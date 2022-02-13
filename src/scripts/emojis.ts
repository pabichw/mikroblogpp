import { EMOJIS, EMOJI_PROMPT } from '../config';
import { insertAtCursor } from '../utils/dom';

const getDropdownHandler = () => document.querySelector('.mordzia-emojisDropdown');

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
        <span class="mordzia-emoji">
            <img src=${chrome.runtime.getURL(EMOJIS[emoji].asset)} alt="${emoji}" title="${emoji}" />
        </span>
    `)
} 

const emojiClick = (e , key, fromDropdown, formHandler) => {
    e.preventDefault();
    const commentInput = formHandler?.querySelector('textarea');
    insertAtCursor(commentInput, `${EMOJI_PROMPT}${key} `);

    if (fromDropdown) {
        const dropdown = getDropdownHandler();
        dropdown.classList.toggle('notVisible')
    }

    let recentlyUsedEmojiKeys = JSON.parse(localStorage.getItem('MIKROBLOG_RECENTLY_USED_EMOJIS'));
    recentlyUsedEmojiKeys = recentlyUsedEmojiKeys.filter(k => k !== key);
    recentlyUsedEmojiKeys.unshift(key);
    recentlyUsedEmojiKeys = recentlyUsedEmojiKeys.slice(0,10);

    localStorage.setItem('MIKROBLOG_RECENTLY_USED_EMOJIS', JSON.stringify(recentlyUsedEmojiKeys));
}

const buildEmojiMenu = (formHandler) => {
    const menu = document.createElement('div');
    menu.className = 'mordzia-emojiMenu';

    const recentlyUsedEmojiKeys = JSON.parse(localStorage.getItem('MIKROBLOG_RECENTLY_USED_EMOJIS'));
    recentlyUsedEmojiKeys.forEach(key => {
        const value = EMOJIS[key];
        const button = document.createElement('a');
        button.href="#";
        button.className="button"
        button.innerHTML= `
            <img src=${chrome.runtime.getURL(value.asset)} title=${key} />
        `;

        button.addEventListener('click', e => emojiClick(e, key, false, formHandler))

        menu.appendChild(button);
    });
    
    if (Object.keys(EMOJIS).length > 10) {
        const dropdownMenu = document.createElement('section');
        dropdownMenu.className = 'mordzia-emojisDropdown notVisible'
        
        Object.entries(EMOJIS).forEach(([key]) => {
            const value = EMOJIS[key];
            const button = document.createElement('a');
            button.href = "#";
            button.className = "button"
            button.title = key;
            
            button.innerHTML = `
                <img src=${chrome.runtime.getURL(value.asset)} />
            `;
    
            button.addEventListener('click', e => emojiClick(e, key, true, formHandler))
    
            dropdownMenu.appendChild(button);
        });

        const dropdownButton = document.createElement('a');
        dropdownButton.href="#";
        dropdownButton.className="button dropdownbutton";
        dropdownButton.innerHTML = `<img src=${chrome.runtime.getURL("assets/arrow-down.svg")} alt="arrow-down" />`
        dropdownButton.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle("notVisible");
            dropdownButton.classList.toggle("rotate");
        })

        menu.appendChild(dropdownButton);
        menu.appendChild(dropdownMenu)
    }
    
    return menu;
}

const injectEmojisMenu = (formElem) => {
    const existingMenuHandler = formElem.querySelector('.mordzia-emojiMenu');
    if (existingMenuHandler) {
        existingMenuHandler.remove() // remove existing menus
    }

    const buttonElem = formElem.querySelector('fieldset.buttons');
    const emojiMenuElem = buildEmojiMenu(formElem);
    buttonElem.insertBefore(emojiMenuElem, buttonElem.firstChild);
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