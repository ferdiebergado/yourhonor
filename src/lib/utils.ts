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

export const getFullName = (person: { firstname: string; mi?: string | null; lastname: string }) =>
  `${person.firstname} ${person.mi ? person.mi + '. ' : ''}${person.lastname}`;
