"use client";

import { useState } from 'react';
import { Copy, Check, ExternalLink, Clock, Tag } from 'lucide-react';

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(summary.createdAt)}
                    </div>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide
          ${summary.type === 'eli5' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' :
                        summary.type === 'detailed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                            'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                    }`}>
                    {summary.type}
                </span>
            </div>

            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors" title={summary.title}>
                {summary.title}
            </h3>

            <div className="grow prose prose-sm dark:prose-invert max-w-none mb-6 overflow-hidden relative">
                <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 line-clamp-6 text-sm leading-relaxed">
                    {summary.summary}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-white dark:from-slate-800 to-transparent pointer-events-none" />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {summary.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] font-semibold bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-600">
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <a
                    href={summary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Read Article
                </a>

                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                        ${copied 
                            ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                            : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20'}`}
                >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
        </div>
    );
}
