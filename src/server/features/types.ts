import type { ActivityDetail } from '@shared/schemas/activity';

export interface Document {
  filename: string;
  doc: Uint8Array;
}

export type ActivityDocDetails = Pick<
  ActivityDetail,
  | 'title'
  | 'venue'
  | 'location'
  | 'firstname'
  | 'mi'
  | 'lastname'
  | 'startDate'
  | 'endDate'
  | 'position'
>;
