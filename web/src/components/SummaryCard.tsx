"use client";

import { useState } from 'react';

interface SummaryProps {
    _id: string;
    title: string;
    summary: string;
    url: string;
    tags: string[];
    createdAt: string;
    type: string;
}

export default function SummaryCard({ summary }: { summary: SummaryProps }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(summary.summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2" title={summary.title}>
                    {summary.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize
          ${summary.type === 'eli5' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                        summary.type === 'detailed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}>
                    {summary.type}
                </span>
            </div>

            <div className="grow prose prose-sm dark:prose-invert max-w-none mb-4 overflow-hidden relative">
                <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 line-clamp-6">
                    {summary.summary}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white dark:from-slate-800 to-transparent pointer-events-none" />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {summary.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="mt-auto flex justify-between items-center text-sm">
                <a
                    href={summary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[50%]"
                >
                    Read Article
                </a>

                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    );
}
