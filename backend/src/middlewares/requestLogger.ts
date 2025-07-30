import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();

  logger.info(`Request on ${method} ${url}`);
  // Continue with the request handling
  next();
};
