import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.toDateString() === end.toDateString()) return formatDate(startDate);

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export const randomBase64 = (length: number) =>
  btoa(String.fromCodePoint(...crypto.getRandomValues(new Uint8Array(length))));

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
