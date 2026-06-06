import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { traceMiddleware } from './middleware/traceId';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import meetingRoutes from './routes/meeting.routes';
import actionItemRoutes from './routes/actionItem.routes';
import { startReminderJob } from './jobs/reminder.job';
import logger from './utils/logger';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Hintro Meeting Intelligence API',
    version: '1.0.0',
    description: 'AI-powered meeting intelligence service'
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        security: [],
        responses: { '200': { description: 'Server is up' } }
      }
    },
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        security: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' }
                }
              }
            }
          }
        },
        responses: { '201': { description: 'User created' } }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Login and get JWT token',
        security: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'Login successful, returns token' } }
      }
    },
    '/api/meetings': {
      post: {
        summary: 'Create a new meeting',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Sprint Planning' },
                  participants: { type: 'array', items: { type: 'string' }, example: ['alice@example.com'] },
                  meetingDate: { type: 'string', example: '2026-05-20T10:00:00Z' },
                  transcript: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        timestamp: { type: 'string' },
                        speaker: { type: 'string' },
                        text: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: { '201': { description: 'Meeting created' } }
      },
      get: {
        summary: 'List all meetings',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } }
        ],
        responses: { '200': { description: 'List of meetings' } }
      }
    },
    '/api/meetings/{id}': {
      get: {
        summary: 'Get a meeting by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Meeting details' } }
      }
    },
    '/api/meetings/{id}/analyze': {
      post: {
        summary: 'Analyze meeting with AI',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'AI analysis with citations' } }
      }
    },
    '/api/action-items': {
      post: {
        summary: 'Create an action item',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  meetingId: { type: 'string' },
                  task: { type: 'string', example: 'Prepare release notes' },
                  assignee: { type: 'string', example: 'Alice' },
                  dueDate: { type: 'string', example: '2026-06-10T10:00:00Z' }
                }
              }
            }
          }
        },
        responses: { '201': { description: 'Action item created' } }
      },
      get: {
        summary: 'List action items',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] } },
          { name: 'assignee', in: 'query', schema: { type: 'string' } },
          { name: 'meetingId', in: 'query', schema: { type: 'string' } }
        ],
        responses: { '200': { description: 'List of action items' } }
      }
    },
    '/api/action-items/{id}/status': {
      patch: {
        summary: 'Update action item status',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'Status updated' } }
      }
    },
    '/api/action-items/overdue': {
      get: {
        summary: 'Get overdue action items',
        responses: { '200': { description: 'List of overdue action items' } }
      }
    },
    '/api/evaluation': {
      get: {
        summary: 'Evaluation endpoint',
        security: [],
        responses: { '200': { description: 'Candidate info' } }
      }
    }
  }
};

const app = express();
app.use(express.json());
app.use(traceMiddleware);

app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/action-items', actionItemRoutes);

app.get('/health', (req, res) => res.json({ status: 'UP' }));

app.get('/api/evaluation', (req, res) => {
  res.json({
    candidateName: 'Manya Sohan',
    email: 'manyasohan27@gmail.com',
    repositoryUrl: 'https://github.com/manyasohan/hintro-meeting-api',
    deployedUrl: 'https://hintro-meeting-api.onrender.com',
    externalIntegration: 'Discord Webhook',
    features: ['Authentication', 'Meeting Management', 'AI Analysis', 'Action Items', 'Overdue Detection', 'Reminder Scheduler', 'Discord Integration']
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info({ message: `Server running on port ${PORT}` });
  startReminderJob();
});

export default app;