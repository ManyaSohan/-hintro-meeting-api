import { Response } from 'express';
import prisma from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { z } from 'zod';

const VALID_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

const createSchema = z.object({
  meetingId: z.string(),
  task: z.string().min(1),
  assignee: z.string().min(1),
  dueDate: z.string().datetime().optional()
});

export const createActionItem = async (req: any, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', parsed.error.issues[0].message, req.traceId);

  const item = await prisma.actionItem.create({
    data: { ...parsed.data, dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null, citations: '[]' }
  });
  sendSuccess(res, item, req.traceId, 201);
};

export const updateStatus = async (req: any, res: Response) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) return sendError(res, 'VALIDATION_ERROR', `Status must be one of: ${VALID_STATUSES.join(', ')}`, req.traceId);

  const item = await prisma.actionItem.update({ where: { id: req.params.id }, data: { status } });
  sendSuccess(res, item, req.traceId);
};

export const listActionItems = async (req: any, res: Response) => {
  const { status, assignee, meetingId } = req.query;
  const where: any = {};
  if (status) where.status = status;
  if (assignee) where.assignee = assignee;
  if (meetingId) where.meetingId = meetingId;

  const items = await prisma.actionItem.findMany({ where });
  sendSuccess(res, items, req.traceId);
};

export const getOverdue = async (req: any, res: Response) => {
  const items = await prisma.actionItem.findMany({
    where: { status: { not: 'COMPLETED' }, dueDate: { lt: new Date() } }
  });
  sendSuccess(res, items, req.traceId);
};