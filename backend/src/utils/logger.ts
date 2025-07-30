import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info', // Minimum log level set to 'info'
  format: combine(
    colorize(), // Adds color to logs in the console
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a separate file
    new transports.File({ filename: 'logs/combined.log' }), // Log all combined logs
  ],
});

// Stream for morgan should use a valid log level
(logger as any).stream = {
  write: (message: string) => {
    logger.info(message.trim()); // Use info instead of http, since `http` is not a valid level
  },
};

export default logger;
