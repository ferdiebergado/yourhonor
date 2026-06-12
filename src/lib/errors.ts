import { authKeys } from '@/features/auth/hooks';
import type { ApiErrorResponse, ErrorCode, ValidationIssue } from '@shared/types';
import { queryClient } from './query-client';

export class AuthenticationError extends Error {
  readonly status = 401;

  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly requestId?: string;
  readonly issues?: ValidationIssue[];

  constructor(response: ApiErrorResponse, status: number) {
    super(response.error.message);

    this.name = 'ApiError';
    this.code = response.error.code;
    this.status = status;
    this.requestId = response.error.requestId;
    this.issues = response.error.issues;
  }
}

export function handleAuthError(error: Error) {
  if (!(error instanceof AuthenticationError)) return;

  const queryKey = authKeys.user;

  queryClient.cancelQueries({ queryKey });

  // eslint-disable-next-line unicorn/no-null
  queryClient.setQueryData(queryKey, null);

  queryClient.removeQueries({
    queryKey,
  });
}
