import { clsx, type ClassValue } from 'clsx';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { ApiError } from './errors';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export async function startDownload(res: Response, filename: string): Promise<void> {
  const blob = await res.blob();

  const url = globalThis.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();

  a.remove();
  globalThis.URL.revokeObjectURL(url);
}

export function setFormErrors<T extends FieldValues>(form: UseFormReturn<T>, error: Error): void {
  if (!(error instanceof ApiError)) return;

  const apiError = error as ApiError;

  if (apiError.code === 'VALIDATION_ERROR' && apiError.issues) {
    for (const issue of apiError.issues) {
      form.setError(issue.path as Path<T>, {
        message: issue.message,
      });
    }
  }
}
