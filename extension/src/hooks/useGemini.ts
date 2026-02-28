
import { useState } from 'react';

type SummaryType = 'brief' | 'detailed' | 'bullets' | 'eli5';

interface UseGeminiReturn {
    loading: boolean;
    error: string | null;
    summary: string | null;
    answer: string | null;
    tags: string[];
    generateSummary: (text: string, type: SummaryType) => Promise<void>;
    askQuestion: (text: string, question: string) => Promise<void>;
    generateTags: (text: string) => Promise<string[]>;
    generateHighlights: (text: string) => Promise<string[]>;
    apiKey: string | null;
    setApiKey: (key: string) => void;
}

export function useGemini(): UseGeminiReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);


    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

    const setApiKeyState = (_key: string) => {

        console.log('Using hardcoded key, ignoring setApiKey');
    };


    const getGeminiResponse = async (prompt: string, key: string) => {
        const model = 'gemini-2.5-flash';
        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.2 },
                    }),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Gemini API Error:", errorData);


                if (res.status === 404 || res.status === 400) {
                    console.log("Attempting to list available models...");
                    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
                    const listData = await listRes.json();
                    console.log("AVAILABLE MODELS:", listData);
                }

                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await res.json();
            return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response available.';
        } catch (e) {
            console.error("Gemini Request Failed", e);
            throw e;
        }
    };

    const generateSummary = async (text: string, type: SummaryType) => {
        if (!apiKey) {
            setError('Please set your Gemini API Key in options.');
            return;
        }

        setLoading(true);
        setError(null);
        setSummary(null);

        const truncatedText = text.length > 20000 ? text.substring(0, 20000) + '...' : text;

        let prompt = `Summarize the following article:\n\n${truncatedText}`;
        switch (type) {
            case 'brief':
                prompt = `Keep it brief. Summarize the following article in 2-3 sentences:\n\n${truncatedText}`;
                break;
            case 'detailed':
                prompt = `Provide a detailed summary of the following article, covering all main points. Use paragraphs:\n\n${truncatedText}`;
                break;
            case 'bullets':
                prompt = `Summarize the following article in 5-7 key points. Format each point starting with "- " (dash space):\n\n${truncatedText}`;
                break;
            case 'eli5':
                prompt = `Explain the main ideas of this article as if I am 5 years old. Use simple language:\n\n${truncatedText}`;
                break;
        }

        try {
            const result = await getGeminiResponse(prompt, apiKey);
            setSummary(result);
        } catch (err: any) {
            setError(err.message || 'Failed to generate summary');
        } finally {
            setLoading(false);
        }
    };

    const askQuestion = async (text: string, question: string) => {
        if (!apiKey) {
            setError('Please set your Gemini API Key first.');
            return;
        }

        setLoading(true);
        setError(null);
        setAnswer(null);

        const truncatedText = text.length > 20000 ? text.substring(0, 20000) + '...' : text;
        const prompt = `Answer this question based on the article provided. Question: "${question}"\n\nArticle:\n${truncatedText}`;

        try {
            const result = await getGeminiResponse(prompt, apiKey);
            setAnswer(result);
        } catch (err: any) {
            setError(err.message || 'Failed to get answer');
        } finally {
            setLoading(false);
        }
    };

    const generateTags = async (text: string): Promise<string[]> => {
        if (!apiKey) return [];

        const truncatedText = text.length > 15000 ? text.substring(0, 15000) + '...' : text;
        const prompt = `Analyze this article and provide exactly 3 relevant tags. Return ONLY the tags separated by commas, no other text. Example: Technology, AI, Future.\n\nArticle:\n${truncatedText}`;

        try {
            const result = await getGeminiResponse(prompt, apiKey);
            const newTags = result.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
            setTags(newTags);
            return newTags;
        } catch (err) {
            console.error('Tag generation failed', err);
            return [];
        }
    };

    const generateHighlights = async (text: string): Promise<string[]> => {
        if (!apiKey) return [];

        const truncatedText = text.length > 15000 ? text.substring(0, 15000) + '...' : text;
        const prompt = `Identify exactly 3 most important sentences from this article that capture the core message. Return ONLY the sentences separated by a pipe symbol "|". Do not alter the sentences, they must match the text exactly.\n\nArticle:\n${truncatedText}`;

        try {
            const result = await getGeminiResponse(prompt, apiKey);
            return result.split('|').map((s: string) => s.trim()).filter((s: string) => s.length > 10);
        } catch (err) {
            console.error('Highlight generation failed', err);
            return [];
        }
    };

    return {
        loading,
        error,
        summary,
        answer,
        tags,
        generateSummary,
        askQuestion,
        generateTags,
        generateHighlights,
        apiKey,
        setApiKey: setApiKeyState,
    };
}
