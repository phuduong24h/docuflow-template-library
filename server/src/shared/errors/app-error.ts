import { ErrorCode, ERROR_CODES } from './error-codes.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, errorCode: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string, errorCode: ErrorCode = ERROR_CODES.BAD_REQUEST, details?: unknown) {
    return new AppError(message, 400, errorCode, details);
  }

  static notFound(message = 'Resource not found', errorCode: ErrorCode = ERROR_CODES.RESOURCE_NOT_FOUND) {
    return new AppError(message, 404, errorCode);
  }

  static fileNotFound(message = 'File does not exist in storage') {
    return new AppError(message, 404, ERROR_CODES.FILE_NOT_FOUND);
  }

  static accessDenied(message = 'Access to this file path is forbidden') {
    return new AppError(message, 403, ERROR_CODES.FILE_ACCESS_DENIED);
  }

  static storageError(message = 'File storage operation failed', details?: unknown) {
    return new AppError(message, 500, ERROR_CODES.FILE_STORAGE_ERROR, details);
  }
}
