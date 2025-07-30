import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import errorHandler from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { indexRouter } from './routes';
import logger from './utils/logger';

dotenv.config();

const app = express();

// Security and logging
app.use(helmet()); // Set security-related HTTP headers
app.use((morgan as any)('combined', { stream: logger.stream })); // Log incoming requests

const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://wsl.rohanthapa.com.np',];

// CORS - Make sure to allow cookies and the correct origin
app.use(
  cors({
    origin: allowedOrigins, // Adjust this if your frontend URL is different
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true, // Enable sending cookies
  }),
);

app.set('trust proxy', 1);
// Cookie parser
// app.use(cookieParser());
app.use(
  cookieSession({
    name: 'session',
    keys: ['thisisthesecretkeyforstoringthesessionincookie'],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  }),
);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware (e.g., request logger)
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
});
app.use(limiter);  // Apply rate limiting globally uncomment on production :)

// app.use('/uploads', express.static(path.resolve('uploads')));

app.use(
  '/api/uploads',
  express.static(path.resolve('uploads'), {
    setHeaders: (res, filePath) => {
      const origin = res.req.headers.origin;

      if (!origin) return;

      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      if (filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
    },
  }),
);

// Routes (we’ll add route files soon)
app.get('/api/', (_req, res) => {
  res.send('Backend API is alive and breathing 🌬️🔥');
});

// Main routes
app.use("/api", indexRouter); // Register the main route handlers (i.e., auth routes, etc.)

// Error handling middleware (this should be the last one)
app.use(errorHandler); // Catch all errors at the end

export default app;
