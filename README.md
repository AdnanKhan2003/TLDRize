# TLDRize - AI-Powered Article Summarizer

## Features
- **Instant AI Summarization**: Professional-grade summaries generated instantly via Google Gemini.
- **Multi-Format Summaries**: Options for ELI5, Brief, and Detailed summaries to suit different needs.
- **Smart Tags**: Automatic categorization using AI-extracted keywords.
- **Centralized Library**: A dedicated web dashboard to archive and manage all saved summaries.
- **Real-time Search**: Instant filtering by title, content, or tags for quick retrieval.
- **Quick Copy**: One-click clipboard functionality for sharing insights.
- **Direct Library Access**: A convenient button in the extension to jump to your web dashboard.

## Tech Stack
- **Dashboard**: Next.js 15 (App Router), React 19.
- **Extension**: Vite, React, TypeScript.
- **Styling**: Tailwind CSS 4, Lucide Icons.
- **Database**: MongoDB Atlas, Mongoose.
- **AI Engine**: Google Gemini 1.5 Flash.

---

## How to Setup

### 1. Extension Setup
- Navigate to `extension/`
- Run `npm install`
- Create `.env` with `VITE_GEMINI_API_KEY`
- Run `npm run build`
- Load the `extension/dist` folder into Chrome via `chrome://extensions/`

### 2. Web Dashboard Setup
- Navigate to `web/`
- Run `npm install`
- Create `.env` with `MONGODB_URI`
- Run `npm run dev`

## Example of .env variables used

### Web (.env)
```env
MONGODB_URI=your-cluster-url
```

### Extension (.env)
```env
VITE_GEMINI_API_KEY=your-gemini-key
```
