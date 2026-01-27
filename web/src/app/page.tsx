import connectToDatabase from '@/lib/db';
import Summary from '@/models/Summary';
import { Suspense } from 'react';
import SummaryCard from '@/components/SummaryCard';

async function getSummaries() {
    await connectToDatabase();
    // Lean query for performance, serialization workaround for plain objects
    const summaries = await Summary.find({}).sort({ createdAt: -1 }).lean();

    return summaries.map((s: any) => ({
        ...s,
        _id: s._id.toString(),
        createdAt: s.createdAt.toISOString(),
    }));
}

export default async function Home() {
    const summaries = await getSummaries();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Library</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            {summaries.length} saved article{summaries.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="hidden sm:block">
                        {/* Search/Filter will go here */}
                        <input
                            type="text"
                            placeholder="Search summaries..."
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </header>

                {summaries.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📚</div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">No summaries yet</h2>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Use the Chrome Extension to summarize articles and save them to your library.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {summaries.map((summary: any) => (
                            <SummaryCard key={summary._id} summary={summary} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
