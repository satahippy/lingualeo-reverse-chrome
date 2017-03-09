let currentIndex = 0;
let currentSentenses;

chrome.runtime.sendMessage({
    from: 'content',
    subject: 'begin'
});

document.getElementById('textContentInner').addEventListener('DOMSubtreeModified', () => {
    currentIndex = 0;
    currentSentenses = null;
}, false);

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.from === 'popup' && msg.subject === 'current') {
        const original = sentenses()[currentIndex++];
        translate(original)
            .then(translated => {
                response({original, translated});
            });
        return true;
    }
});

const sentenses = () => {
    if (!currentSentenses) {
        currentSentenses = [];
        document.querySelectorAll('#textContentInner > context').forEach(element => {
            currentSentenses.push(element.textContent);
        });
    }
    return currentSentenses;
};

const translate = (text) => {
    return fetch(`http://api.lingualeo.com/gettranslates?word=${text}`)
        .then(response => response.json())
        .then(json => json.translate[0].value);
};