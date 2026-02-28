import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Summary from '@/models/Summary';

export async function GET() {
    try {
        await connectToDatabase();
        const summaries = await Summary.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: summaries });
    } catch (error) {
        console.error('Error fetching summaries:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch summaries' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const { url, title, summary, type, tags } = body;


        if (!url || !title || !summary) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const newSummary = await Summary.create({
            url,
            title,
            summary,
            type: type || 'brief',
            tags: tags || [],
        });

        return NextResponse.json({ success: true, data: newSummary }, { status: 201 });
    } catch (error) {
        console.error('Error creating summary:', error);
        return NextResponse.json({ success: false, error: 'Failed to create summary' }, { status: 500 });
    }
}
