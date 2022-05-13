export const insertAtCursor = (myField, myValue): void => {
    if (myField.selectionStart) {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
    
    myField.focus();
}

export const spierdalacz = (elem: HTMLElement, checkBreak?: () => bool): void => {
    elem.addEventListener('mouseenter', () => {
        if (checkBreak()) {
            return 
        }
        elem.style.left = `${Math.random() * 40 - 20}px`;
        elem.style.top = `${Math.random() * 40 - 20}px`;
    })
}