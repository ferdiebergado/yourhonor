import type { ZodError } from 'zod';

import { ERROR_CODES, type ErrorCode } from '@shared/types';

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly isOperational: boolean;
  readonly issues?: {
    path: string;
    message: string;
  }[];

  constructor(options: {
    message: string;
    statusCode: number;
    code: ErrorCode;
    issues?: {
      path: string;
      message: string;
    }[];
    cause?: unknown;
  }) {
    super(options.message, {
      cause: options.cause,
    });

    this.name = this.constructor.name;
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.issues = options.issues;
    this.isOperational = true;
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    issues?: {
      path: string;
      message: string;
    }[]
  ) {
    super({
      message,
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      issues,
    });
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super({
      message,
      statusCode: 400,
      code: ERROR_CODES.BAD_REQUEST,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super({
      message,
      statusCode: 401,
      code: ERROR_CODES.UNAUTHORIZED,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super({
      message,
      statusCode: 403,
      code: ERROR_CODES.FORBIDDEN,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super({
      message,
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super({
      message,
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
    });
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service Unavailable') {
    super({
      message,
      statusCode: 503,
      code: ERROR_CODES.SERVICE_UNAVAILABLE,
    });
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(message = 'Method not allowed') {
    super({
      message,
      statusCode: 405,
      code: ERROR_CODES.SERVICE_UNAVAILABLE,
    });
  }
}

export function fromZodError(error: ZodError) {
  return new ValidationError(
    'Validation failed',
    error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
    }))
  );
}
