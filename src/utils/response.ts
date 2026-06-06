import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, traceId: string, status = 200) => {
  return res.status(status).json({ traceId, success: true, data });
};

export const sendError = (res: Response, code: string, message: string, traceId: string, status = 400) => {
  return res.status(status).json({ traceId, success: false, error: { code, message } });
};