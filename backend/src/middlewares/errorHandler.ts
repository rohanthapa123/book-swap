import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(`${err.status || 500} - ${err.message}`); // Log the error stack for debugging
  console.log(err.message);
  const statusCode = err.statusCode || 500; // Default to 500 if no status code is provided
  const message = err.message || 'Internal Server Error'; // Default message if no specific message is provided

  res.status(statusCode).json({
    message,
    // Optionally include the stack trace in development (you can remove this for production)
    // stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
