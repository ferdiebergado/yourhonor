import { getFullName } from '@shared/utils';
import { TemplateHandler } from 'easy-template-x';

const templateHandler = new TemplateHandler();

export async function buildReport(
  template: Buffer,
  data: { data: Record<string, string>[] },
) {
  return await templateHandler.process(template, data);
}

/**
 * Format activity venue information
 */
export function formatVenue(venue: string, location: string) {
  return location.toLocaleLowerCase() === 'online'
    ? 'online'
    : `at ${venue}, ${location}`;
}

export function formatName({
  firstname,
  mi,
  lastname,
}: {
  firstname: string;
  mi?: string | null;
  lastname: string;
}) {
  return getFullName({
    firstname,
    mi,
    lastname,
  }).toLocaleUpperCase();
}
