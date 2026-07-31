import { getFullName } from '@shared/utils';

export const formatName = ({
  firstname,
  mi,
  lastname,
}: {
  firstname: string;
  mi?: string | null;
  lastname: string;
}) =>
  getFullName({
    firstname,
    mi,
    lastname,
  }).toLocaleUpperCase();

/**
 * Format activity venue information
 */
export const formatVenue = (venue: string, location: string) =>
  location.toLocaleLowerCase() === 'online'
    ? 'online'
    : `at ${venue}, ${location}`;

export const getElapsedTime = (start: number) =>
  `${((performance.now() - start) / 1000).toFixed(3)}s`;
