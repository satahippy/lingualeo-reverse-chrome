chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.from === 'content' && msg.subject === 'begin') {
        chrome.pageAction.show(sender.tab.id);
    }
});