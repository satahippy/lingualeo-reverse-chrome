let currentIndex = 0;
let currentSentenses;

chrome.runtime.sendMessage({
    from: 'content',
    subject: 'begin'
});

document.getElementById('textContentInner').addEventListener('DOMSubtreeModified', () => {
    // todo need to check the content?
    currentIndex = 0;
    currentSentenses = null;
});

let currentSentenseHovered = null;
document.addEventListener('mousedown', (e) => {
    if(e.button != 2) { 
        return ;
    }
    currentSentenseHovered = getParentByTagName(e.target, 'context');
    console.log(currentSentenseHovered);
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.from === 'popup' && msg.subject === 'current') {
        const original = sentenses()[currentIndex++];
        translate(original)
            .then(translated => {
                response({original, translated});
            });
        return true;
    } else if (msg.from === 'background' && msg.subject === 'startFromHere') {
        currentIndex = parseInt(currentSentenseHovered.getAttribute('data-index')) || 0;
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
    const scheme = window.location.protocol;
    return fetch(`${scheme}//api.lingualeo.com/gettranslates?word=${text}`)
        .then(response => response.json())
        .then(json => json.translate[0].value);
};

const getParentByTagName = (node, tagname) => {
	var parent;
	if (node === null || tagname === '') return;
	parent  = node.parentNode;
	tagname = tagname.toUpperCase();

	while (parent.tagName !== "HTML") {
		if (parent.tagName === tagname) {
			return parent;
		}
		parent = parent.parentNode;
	}

	return parent;
};