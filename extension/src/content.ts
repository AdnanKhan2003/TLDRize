
// Content Script

console.log('AI Summarizer Content Script Loaded');

// Function to extract text from the article
function getArticleText(): string {
    const article = document.querySelector('article');
    if (article) return article.innerText;

    // Fallback: Get all paragraphs
    const paragraphs = Array.from(document.querySelectorAll('p'));
    return paragraphs.map((p) => p.innerText).join('\n\n');
}

// Listen for messages
chrome.runtime.onMessage.addListener((request: { type: string; sentences?: string[] }, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    if (request.type === 'GET_ARTICLE_TEXT') {
        const text = getArticleText();
        sendResponse({ text });
    }

    if (request.type === 'HIGHLIGHT_TEXT') {
        const sentences = request.sentences as string[];

        // Remove existing highlights
        document.querySelectorAll('mark.ai-highlight').forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent || ''), el);
            }
        });

        // Simple text finder and highlighter
        // Note: This is a basic implementation. Robust finding requires more complex DOM traversal.
        sentences.forEach(sentence => {
            if (sentence.length < 10) return;

            // Escape regex properties
            // const cleanSentence = sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Try to find text nodes containing the sentence
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent && node.textContent.includes(sentence)) {
                    const span = document.createElement('mark');
                    span.className = 'ai-highlight';
                    span.style.backgroundColor = '#fef08a'; // yellow-200
                    span.style.color = '#000';
                    span.textContent = sentence;

                    const parts = node.textContent.split(sentence);
                    const parent = node.parentNode;
                    if (parent) {
                        parent.insertBefore(document.createTextNode(parts[0]), node);
                        parent.insertBefore(span, node);
                        parent.insertBefore(document.createTextNode(parts[1]), node);
                        parent.removeChild(node);
                    }
                    break; // Highlight first occurrence only
                }
            }
        });

        sendResponse({ status: 'success' });
    }
});
