
// Background Service Worker
console.log('AI Summarizer Background Script Loaded');

chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Summarizer installed');
});

// Example: Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message: { type: string }, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    if (message.type === 'PING') {
        sendResponse({ status: 'PONG' });
    }
});
