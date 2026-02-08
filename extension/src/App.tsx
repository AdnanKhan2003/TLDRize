
import { useState, useEffect } from 'react';
import { useGemini } from './hooks/useGemini';
import {

  FileText,
  List,
  BookOpen,
  Baby,
  Send,
  Copy,
  Check,
  Save,
  MessageSquare
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const [activeTab, setActiveTab] = useState<'summarize' | 'ask'>('summarize');
  const [mode, setMode] = useState<'brief' | 'detailed' | 'bullets' | 'eli5'>('brief');
  const [question, setQuestion] = useState('');
  const [articleText, setArticleText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Advanced Features State
  const [savedTime, setSavedTime] = useState(0);
  const [pageTitle, setPageTitle] = useState('');
  const [pageUrl, setPageUrl] = useState('');

  const {
    loading,
    error,
    summary,
    answer,
    tags,
    generateSummary,
    askQuestion,
    generateTags,
    generateHighlights
  } = useGemini();

  useEffect(() => {
    // Get article text & metadata on load
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab?.id) {
          setPageTitle(tab.title || 'Untitled Article');
          setPageUrl(tab.url || '');

          chrome.tabs.sendMessage(tab.id, { type: 'GET_ARTICLE_TEXT' }, (response) => {
            if (response && response.text) {
              setArticleText(response.text);
            }
          });
        }
      });

      // Load total saved time
      chrome.storage.local.get(['totalSavedTime'], (result: { totalSavedTime?: number }) => {
        setSavedTime(result.totalSavedTime || 0);
      });
    }
  }, []);

  const calculateReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200); // 200 wpm
  };

  const handleSummarize = async () => {
    if (articleText) {
      await generateSummary(articleText, mode);

      // Update reading time saved
      const time = calculateReadingTime(articleText);
      const newTotal = savedTime + time;
      setSavedTime(newTotal);
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ totalSavedTime: newTotal });
      }
    }
  };

  const handleHighlight = async () => {
    if (articleText) {
      const sentences = await generateHighlights(articleText);
      if (sentences.length > 0) {
        // Send to content script
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
          if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, { type: 'HIGHLIGHT_TEXT', sentences });
          }
        });
      }
    }
  };

  const handleAsk = () => {
    if (articleText && question.trim()) {
      askQuestion(articleText, question);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!summary) return;

    try {
      // 1. Generate tags if missing
      const currentTags = tags.length > 0 ? tags : await generateTags(articleText || '');

      // 2. Post to Web App
      const response = await fetch('http://localhost:3000/api/summaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: pageUrl,
          title: pageTitle,
          summary: summary,
          type: mode,
          tags: currentTags
        })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.error('Failed to save');
      }
    } catch (e) {
      console.error('Save error', e);
    }
  };


  /* 
  // Removed Setup Screen for Hardcoded Key
  if (!apiKey) {
    return ( ... );
  }
  */

  return (
    <div className="w-[400px] min-h-[500px] bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600">
          <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
          <h1 className="font-bold text-lg">TLDRize</h1>
        </div>
        {/* Settings Button Removed
        <button onClick={openOptions} className="text-slate-400 hover:text-slate-600">
          <Settings className="w-5 h-5" />
        </button>
        */}
      </header>

      {/* Tabs */}
      <div className="p-4 pb-0">
        <div className="bg-slate-200 p-1 rounded-xl flex">
          <button
            onClick={() => setActiveTab('summarize')}
            className={cn(
              "flex-1 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
              activeTab === 'summarize' ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
            )}
          >
            <FileText className="w-4 h-4" /> Summarize
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={cn(
              "flex-1 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
              activeTab === 'ask' ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
            )}
          >
            <MessageSquare className="w-4 h-4" /> Ask AI
          </button>
        </div>
      </div>

      <main className="flex-1 p-4 flex flex-col gap-4">
        {activeTab === 'summarize' && (
          <>
            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'brief', label: 'Brief', icon: FileText },
                { id: 'detailed', label: 'Detailed', icon: BookOpen },
                { id: 'bullets', label: 'Bullets', icon: List },
                { id: 'eli5', label: 'ELI5', icon: Baby },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border text-sm font-medium transition-all text-left",
                    mode === m.id
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                  )}
                >
                  <m.icon className="w-4 h-4" /> {m.label}
                </button>
              ))}
            </div>

            {/* Action Buttons Grid */}
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleSummarize}
                disabled={loading || !articleText}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Summarizing...
                  </div>
                ) : !articleText ? "No Article" : "Summarize"}
              </button>

              <button
                onClick={handleHighlight}
                disabled={loading || !articleText}
                title="Highlight Key Sentences"
                className="px-4 bg-amber-100 text-amber-700 rounded-xl font-medium hover:bg-amber-200 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                <div className="flex flex-col items-center leading-none gap-0.5">
                  <div className="text-xs">KEY</div>
                  <div className="text-[10px] opacity-75">POINTS</div>
                </div>
              </button>
            </div>

            {/* Reading Time Saved */}
            {savedTime > 0 && (
              <div className="text-center text-xs text-green-600 font-medium bg-green-50 py-1.5 rounded-lg border border-green-100 mb-2">
                🎉 You've saved approx. {savedTime} mins of reading time!
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* Result Area */}
            {summary && (
              <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="prose prose-sm prose-slate max-w-none mb-3">
                  <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">
                    {summary}
                  </p>

                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                      {tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Persistent Action Buttons */}
                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleCopy(summary)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={handleSave}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border",
                      saved
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "text-slate-500 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-100"
                    )}
                  >
                    {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    {saved ? "Saved" : "Save to Lib"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'ask' && (
          <div className="flex flex-col h-full gap-3">
            <div className="flex-1 overflow-y-auto min-h-[200px] bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              {!answer ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
                  <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">Ask a specific question about the article using the input below.</p>
                </div>
              ) : (
                <div className="prose prose-sm prose-slate">
                  <p className="whitespace-pre-wrap text-slate-700">{answer}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="E.g. What is the main conclusion?"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              />
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
