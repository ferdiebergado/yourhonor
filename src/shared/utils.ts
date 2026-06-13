import { SG29 } from './constants';
import type { NewHonorarium } from './schemas/honorarium';

export const getMaxSalary = (salary: number) => Math.min(SG29, salary);

export function computeHonorarium(
  gross: number,
  salary: number,
  taxRate: number
): Pick<NewHonorarium, 'hoursRendered' | 'actual' | 'net'> {
  const maxSalary = getMaxSalary(salary);

  let hoursRendered = 0;
  let actual: number;

  while (true) {
    actual = 0.023 * maxSalary * hoursRendered;

    if (actual >= gross) break;
    hoursRendered++;
  }

  const net = gross - gross * (taxRate / 100);

  return {
    hoursRendered,
    actual,
    net,
  };
}

export const formatAmount = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    currencyDisplay: 'code',
  }).format(amount);

export const getFullName = (person: { firstname: string; mi?: string | null; lastname: string }) =>
  `${person.firstname} ${person.mi ? person.mi + '. ' : ''}${person.lastname}`;

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export const formatDate = (date: string | Date) =>
  dateFormat.format(typeof date === 'string' ? new Date(date) : date);

export const formatDateRange = (start: string, end: string): string =>
  dateFormat.formatRange(new Date(start), new Date(end));
