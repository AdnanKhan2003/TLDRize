

console.log('AI Summarizer Background Script Loaded');

chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Summarizer installed');
});


chrome.runtime.onMessage.addListener((message: { type: string }, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    if (message.type === 'PING') {
        sendResponse({ status: 'PONG' });
    }
});
