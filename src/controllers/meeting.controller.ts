import { Response } from 'express';
import prisma from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { analyzeMeeting } from '../services/ai.service';
import { z } from 'zod';

const meetingSchema = z.object({
  title: z.string().min(1),
  participants: z.array(z.string().email()),
  meetingDate: z.string().datetime(),
  transcript: z.array(z.object({
    timestamp: z.string(),
    speaker: z.string(),
    text: z.string()
  }))
});

export const createMeeting = async (req: any, res: Response) => {
  const parsed = meetingSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', parsed.error.issues[0].message, req.traceId);

  const { title, participants, meetingDate, transcript } = parsed.data;
  const meeting = await prisma.meeting.create({
    data: {
      title,
      participants: JSON.stringify(participants),
      meetingDate: new Date(meetingDate),
      transcript: JSON.stringify(transcript),
      userId: req.user.id
    }
  });
  sendSuccess(res, { ...meeting, participants, transcript }, req.traceId, 201);
};

export const getMeeting = async (req: any, res: Response) => {
  const meeting = await prisma.meeting.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { analysis: true, actionItems: true }
  });
  if (!meeting) return sendError(res, 'NOT_FOUND', 'Meeting not found', req.traceId, 404);
  sendSuccess(res, {
    ...meeting,
    participants: JSON.parse(meeting.participants),
    transcript: JSON.parse(meeting.transcript)
  }, req.traceId);
};

export const listMeetings = async (req: any, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [meetings, total] = await Promise.all([
    prisma.meeting.findMany({ where: { userId: req.user.id }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.meeting.count({ where: { userId: req.user.id } })
  ]);

  sendSuccess(res, {
    meetings: meetings.map(m => ({ ...m, participants: JSON.parse(m.participants) })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  }, req.traceId);
};

export const analyzeMeetingController = async (req: any, res: Response) => {
  const meeting = await prisma.meeting.findFirst({ where: { id: req.params.id, userId: req.user.id } });
  if (!meeting) return sendError(res, 'NOT_FOUND', 'Meeting not found', req.traceId, 404);

  const transcript = JSON.parse(meeting.transcript);
  const result = await analyzeMeeting(transcript);

  await prisma.analysis.upsert({
    where: { meetingId: meeting.id },
    update: { summary: JSON.stringify(result.summary), decisions: JSON.stringify(result.decisions), followUps: JSON.stringify(result.followUps) },
    create: { meetingId: meeting.id, summary: JSON.stringify(result.summary), decisions: JSON.stringify(result.decisions), followUps: JSON.stringify(result.followUps) }
  });

  for (const item of result.actionItems || []) {
    await prisma.actionItem.create({
      data: {
        meetingId: meeting.id,
        task: item.task,
        assignee: item.assignee,
        citations: JSON.stringify(item.citations),
        status: 'PENDING'
      }
    });
  }

  sendSuccess(res, { ...result }, req.traceId);
};