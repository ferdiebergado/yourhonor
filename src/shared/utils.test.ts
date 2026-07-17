import { describe, expect, it } from 'vitest';
import { computeHonorarium, formatAmount, formatDate, formatDateRange, getFullName } from './utils';

describe('utils', () => {
  describe('computeHonorarium', () => {
    it('should calculate honorarium correctly for normal cases', () => {
      const result = computeHonorarium(1000, 50000, 10);

      // With gross=1000, salary=50000, taxRate=10
      // maxSalary = min(187531, 50000) = 50000
      // hoursRendered = ceil(1000 / (0.023 * 50000)) = ceil(1000 / 1150) = ceil(0.869) = 1
      // actual = 0.023 * 50000 * 1 = 1150
      // net = 1000 - 1000 * (10/100) = 900

      expect(result.hoursRendered).toBe(1);
      expect(result.actual).toBe(1150);
      expect(result.net).toBe(900);
    });

    it('should handle zero gross amount', () => {
      const result = computeHonorarium(0, 50000, 10);

      expect(result.hoursRendered).toBe(0);
      expect(result.actual).toBe(0);
      expect(result.net).toBe(0);
    });

    it('should handle zero salary', () => {
      const result = computeHonorarium(1000, 0, 10);

      expect(result.hoursRendered).toBe(0);
      expect(result.actual).toBe(0);
      expect(result.net).toBe(900); // 1000 - 1000 * (10/100)
    });

    it('should handle zero tax rate', () => {
      const result = computeHonorarium(1000, 50000, 0);

      expect(result.hoursRendered).toBe(1);
      expect(result.actual).toBe(1150);
      expect(result.net).toBe(1000); // 1000 - 1000 * (0/100)
    });

    it('should handle high salary (capped at SG29)', () => {
      const result = computeHonorarium(1000, 200000, 10);

      // With salary=200000, maxSalary = min(187531, 200000) = 187531
      // hoursRendered = ceil(1000 / (0.023 * 187531)) = ceil(1000 / 4313.213) = ceil(0.232) = 1
      // actual = 0.023 * 187531 * 1 = 4313.213

      expect(result.hoursRendered).toBe(1);
      expect(result.actual).toBeCloseTo(4313.213);
      expect(result.net).toBe(900);
    });

    it('should handle negative gross amount', () => {
      const result = computeHonorarium(-1000, 50000, 10);

      expect(result.hoursRendered).toBe(0);
      expect(result.actual).toBe(0);
      expect(result.net).toBe(-900); // -1000 - (-1000) * (10/100)
    });

    it('should handle negative salary', () => {
      const result = computeHonorarium(1000, -50000, 10);

      expect(result.hoursRendered).toBe(0);
      expect(result.actual).toBe(0);
      expect(result.net).toBe(900);
    });

    it('should handle exact calculation when gross equals one hour', () => {
      // Find a salary that makes one hour exactly equal to the gross
      // gross = 0.023 * maxSalary * 1
      // maxSalary = gross / 0.023

      const gross = 1150;
      const salary = gross / 0.023; // ~50000
      const result = computeHonorarium(gross, salary, 10);

      expect(result.hoursRendered).toBe(1);
      expect(result.actual).toBe(gross);
      expect(result.net).toBe(1035); // 1150 - 1150 * (10/100)
    });

    it('should handle exact calculation when gross is slightly more than one hour', () => {
      const gross = 1151; // Just over one hour's worth
      const salary = 50000;
      const result = computeHonorarium(gross, salary, 10);

      // hoursRendered = ceil(1151 / (0.023 * 50000)) = ceil(1151 / 1150) = ceil(1.0008) = 2
      // actual = 0.023 * 50000 * 2 = 2300

      expect(result.hoursRendered).toBe(2);
      expect(result.actual).toBe(2300);
      expect(result.net).toBe(1035.9); // 1151 - 1151 * (10/100)
    });
  });

  describe('formatAmount', () => {
    it('should format currency correctly', () => {
      const result = formatAmount(1234.56);
      expect(result).toBe('PHP 1,234.56');
    });

    it('should handle zero amount', () => {
      const result = formatAmount(0);
      expect(result).toBe('PHP 0.00');
    });

    it('should handle negative amount', () => {
      const result = formatAmount(-1234.56);
      expect(result).toBe('PHP -1,234.56');
    });
  });

  describe('getFullName', () => {
    it('should format full name correctly with middle initial', () => {
      const person = { firstname: 'John', mi: 'D', lastname: 'Doe' };
      const result = getFullName(person);
      expect(result).toBe('John D. Doe');
    });

    it('should format full name correctly without middle initial', () => {
      const person = { firstname: 'John', lastname: 'Doe' };
      const result = getFullName(person);
      expect(result).toBe('John Doe');
    });

    it('should handle empty middle initial', () => {
      const person = { firstname: 'John', mi: '', lastname: 'Doe' };
      const result = getFullName(person);
      expect(result).toBe('John Doe');
    });

    it('should handle null middle initial', () => {
      const person = { firstname: 'John', mi: null, lastname: 'Doe' };
      const result = getFullName(person);
      expect(result).toBe('John Doe');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly from Date object', () => {
      const date = new Date('2023-12-25');
      const result = formatDate(date);
      expect(result).toBe('December 25, 2023');
    });

    it('should format date correctly from string', () => {
      const date = '2023-12-25';
      const result = formatDate(date);
      expect(result).toBe('December 25, 2023');
    });
  });

  describe('formatDateRange', () => {
    it('should format date range correctly', () => {
      const start = '2023-12-25';
      const end = '2023-12-30';
      const result = formatDateRange(start, end);
      expect(result).toBe('December 25 – 30, 2023');
    });
  });
});
