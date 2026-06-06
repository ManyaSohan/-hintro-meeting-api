import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (err: any, req: any, res: Response, next: NextFunction) => {
  logger.error({ traceId: req.traceId, error: err.message, path: req.path });
  res.status(500).json({
    traceId: req.traceId,
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' }
  });
};