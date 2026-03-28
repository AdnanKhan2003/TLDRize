# TLDRize - AI-Powered Article Summarizer

## Demo
- **Video:** https://adnankhan-dev.netlify.app/projects/tldrize

## Existing System
Historically, summarizing long-form articles was a manual, paper-based process. Readers had to highlight physical text or take handwritten notes to distill key points. There was no digital bridge between professional web content and personal knowledge retention, leading to fragmented information and time-consuming manual effort.

## Problem Statement
With the explosion of digital content, users face extreme information overload. Long articles are often bookmarked but never read due to time constraints. Manual note-taking is inefficient for the fast-paced digital age, and existing tools often lack a centralized, searchable library for these insights.

## Features
- **Instant AI Summarization**: Professional-grade summaries generated instantly via Google Gemini.
- **Multi-Format Summaries**: Options for ELI5, Brief, and Detailed summaries to suit different needs.
- **Smart Tags**: Automatic categorization using AI-extracted keywords.
- **Centralized Library**: A dedicated web dashboard to archive and manage all saved summaries.
- **Real-time Search**: Instant filtering by title, content, or tags for quick retrieval.
- **Quick Copy**: One-click clipboard functionality for sharing insights.
- **Direct Library Access**: A convenient button in the extension to jump to your web dashboard.

## Technical Challenges
- **Dynamic Content Extraction**: Creating a content script that accurately identifies the "main" article text while ignoring navbars, ads, and sidebars across different websites is inherently difficult. **Solution**: We implemented a robust DOM traversal strategy in `content.ts` to focus on `<article>` tags and high-density text containers.
- **Extension-to-Dashboard Navigation**: Standard `window.open` calls behave inconsistently inside Chrome extension popups. **Solution**: We utilized the `chrome.tabs` API in the extension's React components to create a seamless link between the summarizer and the web dashboard.
- **Real-time Library Filtering**: Implementing a search feature that remains fast as the library grows required careful state management. **Solution**: We built the `SummaryList` component using React 19 memoization and optimized client-side filtering to search across titles, summaries, and tags concurrently.

## Tech Stack
- **Dashboard**: Next.js 15 (App Router), React 19.
- **Extension**: Vite, React, TypeScript.
- **Styling**: Tailwind CSS 4, Lucide Icons.
- **Database**: MongoDB Atlas, Mongoose.
- **AI Engine**: Google Gemini 1.5 Flash.

## Conclusion
TLDRize transforms how we consume digital content by turning long-form articles into actionable, searchable knowledge. It eliminates the friction of manual summarization, allowing users to stay informed and organized in an information-heavy world.

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
