import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const register = async (req: any, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', parsed.error.issues[0].message, req.traceId);

  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return sendError(res, 'CONFLICT', 'Email already registered', req.traceId, 409);

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed } });
  sendSuccess(res, { id: user.id, email: user.email }, req.traceId, 201);
};

export const login = async (req: any, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', parsed.error.issues[0].message, req.traceId);

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', req.traceId, 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', req.traceId, 401);

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  sendSuccess(res, { token }, req.traceId);
};