chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.from === 'content' && msg.subject === 'begin') {
        chrome.pageAction.show(sender.tab.id);
    }
});

chrome.contextMenus.create({
    title: 'LRC: start from here',
    contexts: ['page'],
    onclick: (info, tab) => {
        chrome.tabs.sendMessage(
            tab.id,
            {from: 'background', subject: 'startFromHere'}
        );
    }
});