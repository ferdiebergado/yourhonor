import type { UnknownRecord } from 'type-fest';

import { API_BASE_URL } from '@shared/constants';
import type { ApiResponse } from '@shared/types';
import { ApiError, AuthenticationError } from './errors';

const headers = { 'Content-Type': 'application/json' };

async function request<T>(path: string, options?: RequestInit): Promise<T | null> {
  let res: Response;

  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      ...options,
    });
  } catch (error) {
    throw new Error('Network error', { cause: error });
  }

  if (res.status === 401) throw new AuthenticationError();

  const body = (await res.json()) as ApiResponse<T>;

  if (!body.success) throw new ApiError(body, res.status);

  // eslint-disable-next-line unicorn/no-null
  if (!body.data) return null;

  return body.data;
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => request<T>(path, options),
  post: <T>(path: string, data?: UnknownRecord, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }),
  put: <T>(path: string, data: UnknownRecord, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    }),
  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'DELETE',
    }),
};
