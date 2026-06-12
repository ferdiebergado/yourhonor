import type { Context } from '@netlify/functions';

import type { ApiErrorResponse } from '@shared/types';
import { AppError } from './errors';
import logger from './logger';

export function handleError(error: unknown, requestId: string): Response {
  logError(error, requestId);

  if (error instanceof AppError) {
    const body: ApiErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        issues: error.issues,
        requestId,
      },
    };

    return Response.json(body, {
      status: error.statusCode,
    });
  }

  const body: ApiErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? 'Something went wrong'
          : error instanceof Error
            ? error.message
            : 'Unknown error',
      requestId,
    },
  };

  return Response.json(body, {
    status: 500,
  });
}

function logError(error: unknown, requestId: string) {
  if (error instanceof Error) {
    logger.error({
      level: 'error',
      requestId,
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return;
  }

  logger.error({
    level: 'error',
    requestId,
    error,
  });
}

type NetlifyHandler = (request: Request, context: Context) => Promise<Response>;

export function withErrorHandling(handler: NetlifyHandler): NetlifyHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error, context.requestId);
    }
  };
}
