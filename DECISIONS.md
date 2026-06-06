\# Technical Decisions



\## 1. Database: SQLite with Prisma

Chosen: SQLite via Prisma ORM

Why: Simple setup, no external database server needed, perfect for this project scope

Alternatives: PostgreSQL, MongoDB

Trade-offs: Not suitable for high concurrency production use, but ideal for this assignment



\## 2. Authentication: JWT

Chosen: JSON Web Tokens (JWT)

Why: Stateless, scalable, widely used standard. No session storage needed.

Alternatives: Session-based auth, OAuth

Trade-offs: Tokens cannot be invalidated before expiry without a blacklist



\## 3. AI Provider: Groq (LLaMA 3.3)

Chosen: Groq API with LLaMA 3.3 70B model

Why: Free tier available, extremely fast inference, high quality outputs

Alternatives: OpenAI GPT-4, Anthropic Claude, Google Gemini

Trade-offs: Rate limits on free tier



\## 4. External Integration: Discord Webhook

Chosen: Discord Webhook

Why: Free, no authentication needed, instant setup, reliable delivery

Alternatives: Slack, Telegram, Email (Resend)

Trade-offs: Requires Discord account



\## 5. Project Structure

Chosen: MVC-like structure (routes/controllers/services)

Why: Clean separation of concerns, easy to maintain and test

Alternatives: Flat structure, feature-based structure

Trade-offs: More files but better organization



\## 6. Validation: Zod

Chosen: Zod schema validation

Why: TypeScript-first, simple API, great error messages

Alternatives: Joi, express-validator

Trade-offs: Slightly more verbose than Joi



\## 7. Logging: Winston

Chosen: Winston logger

Why: Widely used, supports structured JSON logging, multiple transports

Alternatives: Pino, Morgan

Trade-offs: Slightly heavier than Pino

