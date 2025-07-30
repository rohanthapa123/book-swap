import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/data-source';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

let server: any;

AppDataSource.initialize()
  .then(async () => {
    logger.info('✅ Connected to PostgreSQL DB');

    server = app.listen(PORT, () => {
      logger.info(`🚀 Server running at http://localhost:${PORT}`);
    });
  })

  .catch((err) => {
    logger.error('❌ Error connecting to the database:', err);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.warn('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      logger.info('🛑 Server closed.');
      process.exit(0);
    });
  }
});

process.on('uncaughtException', (err) => {
  logger.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('💥 Unhandled Rejection:', reason);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
