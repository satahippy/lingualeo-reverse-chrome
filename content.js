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
        currentSentenses = retrieveWindowVariable('CONFIG').pages.contentView.contentSentences;
    }
    return currentSentenses;
};

const translate = (text) => {
    return fetch(`http://api.lingualeo.com/gettranslates?word=${text}`)
        .then(response => response.json())
        .then(json => json.translate[0].value);
};

const retrieveWindowVariable = (variable) => {
    let scriptContent = "var data = document.createElement('div');";
    scriptContent += "data.id = 'tmpData';";
    scriptContent += "data.appendChild(document.createTextNode(JSON.stringify(" + variable + ")));";
    scriptContent += "document.body.appendChild(data);";

    const script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    const result = JSON.parse(document.getElementById('tmpData').textContent);

    document.getElementById('tmpScript').remove();
    document.getElementById('tmpData').remove();    

    return result;
}