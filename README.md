
# 🧠 Hintro Meeting Intelligence API

> AI-powered meeting intelligence service that helps teams capture insights, action items, decisions, and follow-ups from conversations.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🔐 Authentication | JWT-based secure authentication |
| 📋 Meeting Management | Create, retrieve, and list meetings with transcripts |
| 🤖 AI Analysis | Auto-generate summaries, decisions, action items with citations |
| 📌 Citation Grounding | Every AI insight is grounded in the transcript |
| ✅ Action Items | Track tasks with status updates and filtering |
| ⏰ Overdue Detection | Automatically detect overdue action items |
| 🔔 Discord Reminders | Automated reminders via Discord webhook |
| 📖 Swagger Docs | Full OpenAPI documentation |

---

## 🛠 Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** SQLite via Prisma ORM
- **AI Provider:** Groq (LLaMA 3.3 70B) — Free tier
- **Notifications:** Discord Webhook
- **Scheduler:** node-cron
- **Validation:** Zod
- **Logging:** Winston
- **Docs:** Swagger UI

---

## 🚀 Live Demo

| Resource | URL |
|----------|-----|
| 🌐 API Base URL | https://hintro-meeting-api.onrender.com |
| 📖 Swagger Docs | https://hintro-meeting-api.onrender.com/api-docs |
| ❤️ Health Check | https://hintro-meeting-api.onrender.com/health |
| 🎯 Evaluation | https://hintro-meeting-api.onrender.com/api/evaluation |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
GROQ_API_KEY="your-groq-api-key"
DISCORD_WEBHOOK_URL="your-discord-webhook-url"
PORT=3000
```

---

## 📦 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/ManyaSohan/-hintro-meeting-api.git
cd -hintro-meeting-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup database
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start the server
```bash
npm run dev
```

### 5. Open Swagger docs
```
http://localhost:3000/api-docs
```

---

## 📡 API Endpoints

### 🔐 Authentication
```
POST /api/auth/register   - Register a new user
POST /api/auth/login      - Login and get JWT token
```

### 📋 Meetings
```
POST   /api/meetings          - Create a meeting
GET    /api/meetings          - List meetings (paginated)
GET    /api/meetings/:id      - Get meeting by ID
POST   /api/meetings/:id/analyze  - Analyze meeting with AI
```

### ✅ Action Items
```
POST   /api/action-items              - Create action item
GET    /api/action-items              - List action items (filterable)
PATCH  /api/action-items/:id/status   - Update status
GET    /api/action-items/overdue      - Get overdue items
```

### 🔧 System
```
GET /health           - Health check
GET /api/evaluation   - Evaluation endpoint
GET /api-docs         - Swagger documentation
```

---

## 💡 API Usage Examples

### Register a user
```bash
curl -X POST https://hintro-meeting-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST https://hintro-meeting-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Create a Meeting
```bash
curl -X POST https://hintro-meeting-api.onrender.com/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Sprint Planning",
    "participants": ["alice@example.com", "bob@example.com"],
    "meetingDate": "2026-05-20T10:00:00Z",
    "transcript": [
      { "timestamp": "00:10", "speaker": "John", "text": "We should launch next Friday." },
      { "timestamp": "00:20", "speaker": "Alice", "text": "I will prepare release notes." }
    ]
  }'
```

### Analyze Meeting with AI
```bash
curl -X POST https://hintro-meeting-api.onrender.com/api/meetings/MEETING_ID/analyze \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🗄️ Database Schema

| Model | Description |
|-------|-------------|
| User | Stores registered users |
| Meeting | Meeting info, participants, transcript |
| Analysis | AI-generated insights per meeting |
| ActionItem | Tasks extracted from meetings |
| Reminder | History of sent reminders |

---

## 🤖 AI Approach

- Uses **Groq LLaMA 3.3 70B** for fast, free inference
- Prompt strictly instructs model to only use transcript content
- Every insight includes **timestamp citations**
- Hallucination prevention via grounding strategy
- See [AI_APPROACH.md](./AI_APPROACH.md) for full details

---

## 📊 Response Format

### Success
```json
{
  "traceId": "abc-123",
  "success": true,
  "data": {}
}
```

### Error
```json
{
  "traceId": "abc-123",
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Meeting title is required"
  }
}
```

---

## 📁 Project Structure

```
src/
├── config/         # Prisma client
├── controllers/    # Route handlers
├── jobs/           # Scheduled jobs
├── middleware/     # Auth, traceId, errorHandler
├── routes/         # Express routes
├── services/       # AI service
└── utils/          # Logger, response helpers
prisma/
└── schema.prisma   # Database schema
```

---

## 📝 Documentation

- [DECISIONS.md](./DECISIONS.md) - Technical decisions
- [AI_APPROACH.md](./AI_APPROACH.md) - AI implementation details
- [TESTING.md](./TESTING.md) - Test scenarios
- [CHANGELOG.md](./CHANGELOG.md) - Implementation history

---

```


Then push:
```cmd
cd C:\Users\User\hintro-meeting-api
git add .
git commit -m "update README"
git push
```

