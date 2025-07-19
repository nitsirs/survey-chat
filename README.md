# Line to Slack Survey Chatbot

A Next.js application that collects survey responses about transitioning from Line to Slack, featuring an AI chatbot for discussing concerns.

## Features

- Survey form with rating scales for personal preference and team readiness
- Interactive chatbot powered by OpenAI that acts as an organizational psychologist
- Smooth UI transition from survey to chat interface
- Google Forms integration for data submission
- Modern, responsive design with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure OpenAI API key:
   - Copy `.env.local` and add your OpenAI API key
   - Replace `your_openai_api_key_here` with your actual key

3. Configure Google Forms:
   - Create a Google Form with corresponding entry IDs
   - Update the form URL and entry IDs in `src/app/page.tsx`

4. Run the development server:
```bash
npm run dev
```

## Project Structure

- `src/app/page.tsx` - Main survey application
- `src/components/RatingScale.tsx` - Rating scale component
- `src/components/ChatBot.tsx` - Chatbot interface
- `src/app/api/chat/route.ts` - OpenAI API integration
- `src/types/index.ts` - TypeScript types

## Configuration

To customize the Google Forms integration, update the following in `page.tsx`:
- Replace `YOUR_FORM_ID` with your Google Form ID
- Update entry field names to match your form structure