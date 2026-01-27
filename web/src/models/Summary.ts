import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISummary extends Document {
    url: string;
    title: string;
    summary: string;
    type: 'brief' | 'detailed' | 'bullets' | 'eli5';
    tags: string[];
    createdAt: Date;
}

const SummarySchema: Schema = new Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    type: { type: String, enum: ['brief', 'detailed', 'bullets', 'eli5'], default: 'brief' },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

// Prevent Mongoose OverwriteModelError
const Summary: Model<ISummary> = mongoose.models.Summary || mongoose.model<ISummary>('Summary', SummarySchema);

export default Summary;
