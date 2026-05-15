import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
