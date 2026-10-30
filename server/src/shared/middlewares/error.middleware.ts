import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { ERROR_CODES } from '../errors/error-codes.js';
import { sendError } from '../utils/response.js';
import { env } from '../../config/env.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errorCode, err.details);
    return;
  }

  // Handle Prisma record not found
  if ('code' in err && (err as { code: string }).code === 'P2025') {
    sendError(res, 'Record not found in database', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
    return;
  }

  console.error('[Unhandled Error]:', err);

  const message = env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message;
  sendError(res, message, 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
}
