# Hintro Meeting Intelligence API

AI-powered meeting intelligence service that helps users manage meetings, extract actionable insights, and stay on top of follow-ups.

## Features
- JWT Authentication
- Meeting Management with transcripts
- AI-powered meeting analysis with citations (Groq/LLaMA)
- Action Item tracking
- Overdue detection
- Discord webhook reminders
- Swagger API documentation

## Tech Stack
- Node.js + TypeScript
- Express.js
- Prisma + SQLite
- Groq AI (LLaMA 3.3)
- Discord Webhooks
- node-cron

## Environment Variables
Create a .env file with these values:

DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
GROQ_API_KEY="your-groq-api-key"
DISCORD_WEBHOOK_URL="your-discord-webhook-url"
PORT=3000

## Local Setup

1. Clone the repo
git clone https://github.com/ManyaSohan/-hintro-meeting-api.git
cd -hintro-meeting-api

2. Install dependencies
npm install

3. Setup database
npx prisma migrate dev --name init
npx prisma generate

4. Start the server
npm run dev

5. Open Swagger docs at http://localhost:3000/api-docs

## API Usage Examples

### Register
POST /api/auth/register
Body: { "email": "user@example.com", "password": "password123" }

### Login
POST /api/auth/login
Body: { "email": "user@example.com", "password": "password123" }

### Create Meeting
POST /api/meetings
Authorization: Bearer YOUR_TOKEN
Body:
{
  "title": "Sprint Planning",
  "participants": ["alice@example.com", "bob@example.com"],
  "meetingDate": "2026-05-20T10:00:00Z",
  "transcript": [
    { "timestamp": "00:10", "speaker": "John", "text": "We should launch next Friday." },
    { "timestamp": "00:20", "speaker": "Alice", "text": "I will prepare release notes." }
  ]
}

### Analyze Meeting with AI
POST /api/meetings/:id/analyze
Authorization: Bearer YOUR_TOKEN

### Get Action Items
GET /api/action-items
Authorization: Bearer YOUR_TOKEN

### Get Overdue Action Items
GET /api/action-items/overdue
Authorization: Bearer YOUR_TOKEN

## API Documentation
Swagger UI available at: /api-docs

## Health Check
GET /health

## Deployment
Platform: Render
URL: https://hintro-meeting-api.onrender.com