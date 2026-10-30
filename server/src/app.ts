import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env.js';
import { templateRouter } from './modules/template/template.routes.js';
import { documentRouter } from './modules/document/document.routes.js';
import { presentationRouter } from './modules/presentation/presentation.routes.js';
import { healthRouter } from './modules/health/health.routes.js';
import { errorHandler } from './shared/middlewares/error.middleware.js';
import { AppError } from './shared/errors/app-error.js';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // Request parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Public thumbnails route (read-only for template previews)
  const thumbnailsDir = path.resolve(env.STORAGE_ROOT, 'thumbnails');
  app.use('/thumbnails', express.static(thumbnailsDir));

  // API v1 Routes
  app.use('/api/v1/health', healthRouter);
  app.use('/api/v1/templates', templateRouter);
  app.use('/api/v1/documents', documentRouter);
  app.use('/api/v1/presentations', presentationRouter);

  // Handle 404 Not Found
  app.use((_req, _res, next) => {
    next(AppError.notFound('API endpoint not found'));
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
