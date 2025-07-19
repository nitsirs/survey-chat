# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Status

This is a newly initialized Git repository named "survey-chat" for building a pulse survey with chatbot integration.

## Project Requirements

Create a React + Node.js application with the following features:

### Frontend (React)
- Survey form with three questions:
  1. "Do you personally want to switch from Line to Slack?" (1-5 rating scale)
  2. "How ready is your team for this switch?" (1-5 rating scale)  
  3. "What are your concerns?" (text input that becomes chatbot)
- Smooth UI transition from form to chat interface when user clicks text input
- Modern, clean design with rating components
- "Continue" button appears after chatbot conversation completes

### Backend (Node.js/Express)
- API endpoint for OpenAI integration
- Chatbot that acts like an organizational psychologist
- References user's previous ratings in conversation
- Asks intelligent follow-up questions about concerns
- Conversation ends after 3 exchanges OR detailed response received

### Integration
- Compile chat conversation into text summary
- Submit final survey data to Google Forms via pre-filled URL
- Handle form submission seamlessly

## Development Setup Needed

Please create:
1. Project structure with frontend/backend folders
2. package.json with React, Express, OpenAI dependencies
3. Survey form component with rating scales
4. Chatbot component with OpenAI integration
5. Google Forms submission functionality

## Next Steps for Development

Initialize the complete project structure and create all necessary components for the survey chatbot application.