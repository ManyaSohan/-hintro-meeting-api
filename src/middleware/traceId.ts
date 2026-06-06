import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const traceMiddleware = (req: any, res: Response, next: NextFunction) => {
  req.traceId = (req.headers['x-trace-id'] as string) || uuidv4();
  res.setHeader('x-trace-id', req.traceId);
  next();
};