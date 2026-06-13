import type { ApiErrorResponse, ErrorCode, ValidationIssue } from '@shared/types';

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
