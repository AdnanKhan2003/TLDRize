import connectToDatabase from '@/lib/db';
import Summary from '@/models/Summary';
import { Suspense } from 'react';
import SummaryList from '@/components/SummaryList';

async function getSummaries() {
    try {
        await connectToDatabase();
        const summaries = await Summary.find({}).sort({ createdAt: -1 }).lean();

        return summaries.map((s: any) => ({
            ...s,
            _id: s._id.toString(),
            createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : new Date().toISOString(),
        }));
    } catch (e) {
        console.error('Failed to fetch summaries:', e);
        return [];
    }
}

export default async function Home() {
    const summaries = await getSummaries();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
            <div className="p-8">
                <Suspense fallback={
                    <div className="max-w-7xl mx-auto py-20 text-center text-slate-400 font-medium animate-pulse">
                        Loading your library...
                    </div>
                }>
                    <SummaryList initialSummaries={summaries} />
                </Suspense>
            </div>
        </main>
    );
}
