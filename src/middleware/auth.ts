import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return sendError(res, 'UNAUTHORIZED', 'No token provided', req.traceId, 401);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch {
    sendError(res, 'INVALID_TOKEN', 'Token is invalid or expired', req.traceId, 401);
  }
};