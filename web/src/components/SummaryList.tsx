"use client";

import { useState } from 'react';
import SummaryCard from './SummaryCard';
import { Search, Library } from 'lucide-react';

interface SummaryProps {
    _id: string;
    title: string;
    summary: string;
    url: string;
    tags: string[];
    createdAt: string;
    type: string;
}

export default function SummaryList({ initialSummaries }: { initialSummaries: SummaryProps[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSummaries = initialSummaries.filter(summary => 
        summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        summary.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        summary.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">My Library</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                        <Library className="w-4 h-4" />
                        {initialSummaries.length} saved article{initialSummaries.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search titles, content, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                    />
                </div>
            </header>

            {filteredSummaries.length === 0 ? (
                <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
                    <div className="text-6xl mb-6">🔍</div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No matches found</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        We couldn't find any summaries matching "{searchQuery}". Try a different keyword.
                    </p>
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="mt-6 text-blue-600 font-semibold hover:underline"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {filteredSummaries.map((summary) => (
                        <div key={summary._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                            <SummaryCard summary={summary} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
