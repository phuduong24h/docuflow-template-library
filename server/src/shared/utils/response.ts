import { Response } from 'express';
import { ErrorCode } from '../errors/error-codes.js';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  error?: {
    code: ErrorCode | string;
    details?: unknown;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: Record<string, unknown>
): void {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  if (meta) {
    payload.meta = meta;
  }
  res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errorCode: ErrorCode | string = 'INTERNAL_SERVER_ERROR',
  details?: unknown
): void {
  const payload: ApiResponse = {
    success: false,
    message,
    error: {
      code: errorCode,
      ...(details !== undefined ? { details } : {}),
    },
  };
  res.status(statusCode).json(payload);
}
