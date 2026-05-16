import type { CamelCasedProperties } from 'type-fest';

import { SG29 } from './constants';
import type { NewHonorarium } from './schemas/honorarium';

const snakeKeyToCamelKey = (key: string): string =>
  key.replaceAll(/_([a-z])/g, (_, char: string) => char.toUpperCase());

export const snakeToCamel = <T extends Record<string, unknown>>(
  value: T
): CamelCasedProperties<T> => {
  const result: Partial<CamelCasedProperties<T>> = {};

  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      const camelKey = snakeKeyToCamelKey(key) as keyof CamelCasedProperties<T>;
      result[camelKey] = value[key] as unknown as CamelCasedProperties<T>[typeof camelKey];
    }
  }

  return result as CamelCasedProperties<T>;
};

export const getMaxSalary = (salary: number) => Math.min(SG29, salary);

export function computeHonorarium(
  gross: number,
  salary: number,
  taxRate: number
): Pick<NewHonorarium, 'hoursRendered' | 'actual' | 'net'> {
  const maxSalary = getMaxSalary(salary);

  let hoursRendered = 0;
  let actual: number;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

export const formatDateRange = (start: string, end: string): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).formatRange(new Date(start), new Date(end));
