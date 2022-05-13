import { PROMO_CONTENT } from '../config';
import { getConfig, setConfig } from '../content_script';
import { spierdalacz } from '../utils/dom';

const hidePromoTrash = (): void => 
    Array.from(document.querySelectorAll('#itemsStream li .text'))
    .forEach(text => 
        text.innerHTML = text.innerHTML.replace(/(?=\[\[)(.*)(?<=\]\])/gi, '') // TODO: USE PROMPTS
    )

const initPromo = async (): Promise<void> => {
    const commentSubmitBtn: HTMLFormElement = document.querySelector('#commentForm .gaSubmit_stream') || document.querySelector('#commentForm .gaSubmit_profile') || document.querySelector('#commentForm .gaSubmit_mywykop') || document.querySelector('#commentForm .gaSubmit_entries');
    const formActions: HTMLElement = document.querySelector('#commentForm .mfUploadHolder');
    const row: HTMLDivElement = document.createElement('div');
    const input: HTMLInputElement = document.createElement('input');
    const label: HTMLLabelElement = document.createElement('label');
    spierdalacz(input, () => !getConfig().ALLOW_PROMO);

    commentSubmitBtn.addEventListener('click', async (e: SubmitEvent): Promise<any> => {
        if (!getConfig().ALLOW_PROMO) {
            return
        }

        const textArea: HTMLTextAreaElement = document.querySelector('#commentForm textarea');
        textArea.value += `\n\n${PROMO_CONTENT}`
    })

    row.className= 'row';

    input.id = 'mbpp-promo-checkbox';
    input.className = 'checkbox mbpp-promo-checkbox';
    input.type="checkbox";
    input.checked = getConfig().ALLOW_PROMO;
    input.onchange = (e) => {
        setConfig('ALLOW_PROMO', e.target.checked)
    }

    label.className = 'inline mbpp-promo-label';
    label.innerText = 'Pomóż promować Mikroblog++';
    
    row.appendChild(input);
    row.appendChild(label);
    formActions.appendChild(row);
    
    hidePromoTrash();
}

const setup = (): void => {
    initPromo();
}

export {
    setup
}