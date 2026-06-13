export const ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNSUPPORTED_MEDIA: 'UNSUPPORTED MEDIA TYPE',
  SERVICE_UNAVAILABLE: 'SERVICE UNAVAILABLE',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type ValidationIssue = {
  path: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    issues?: ValidationIssue[];
    requestId?: string;
  };
};

export type ApiSuccessResponse<T> = {
  success: true;
  data?: T;
};

export type ApiResponse<T = undefined> = ApiSuccessResponse<T> | ApiErrorResponse;
