import type { ApiErrorResponse } from '@shared/types';
import { AppError } from './errors';
import type { RequestContext } from './http';
import logger from './logger';

export function handleError(error: unknown, context: RequestContext): Response {
  logError(error, context);

  const { requestId } = context;

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

function logError(error: unknown, context: RequestContext) {
  const loggerWithCtx = logger.child({ context });

  if (error instanceof Error) {
    loggerWithCtx.error({
      level: 'error',
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return;
  }

  loggerWithCtx.error({
    level: 'error',
    error,
  });
}
