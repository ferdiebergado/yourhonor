import * as z from 'zod';

import { BaseSchema, type EntityUpdate, type NewEntity } from './base';
import { FocalFormSchema } from './focal';
import type { HonorariumInfo } from './honorarium';
import { VenueFormSchema } from './venue';

export const ActivitySchema = z.strictObject({
  ...BaseSchema.shape,

  title: z
    .string()
    .min(1, 'Activity title is required')
    .max(250, 'Activity title should not exceed 250 characters'),
  startDate: z.iso.date('Start date must be a valid date'),
  endDate: z.iso.date('End date must be a valid date'),
  venueId: z.coerce.number<number>().positive('Venue is required'),
  code: z.stringFormat(
    'activity code',
    /^AC-\d{2}-[A-Z]{2,15}-[A-Z]{2,15}-[A-Z]{2,15}-(?:P\d+|\d+-\d+|\d+)$/
  ),
  fundSource: z.string(),
  focalId: z.coerce.number<number>().positive('Focal person is required'),
});

export type Activity = z.infer<typeof ActivitySchema>;

export const ActivityInfoSchema = z.strictObject({
  ...ActivitySchema.pick({
    id: true,
    title: true,
    startDate: true,
    endDate: true,
    code: true,
  }).shape,

  ...VenueFormSchema.shape,
});

export type ActivityInfo = z.infer<typeof ActivityInfoSchema>;

export type NewActivity = NewEntity<Activity>;

export const ActivityFormSchema = ActivitySchema.pick({
  title: true,
  code: true,
  venueId: true,
  focalId: true,
  startDate: true,
  endDate: true,
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  path: ['endDate'],
  message: 'End date must be on or after start date',
});

export type ActivityFormValues = z.infer<typeof ActivityFormSchema>;

const VenueSchema = z.strictObject({
  ...VenueFormSchema.pick({ location: true }).shape,
  venue: z.string(),
});

const FocalSchema = z.strictObject({
  ...FocalFormSchema.omit({ positionId: true }).shape,
  position: z.string(),
});

export const ActivityDetailSchema = z.strictObject({
  ...ActivitySchema.omit({
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
    deletedAt: true,
  }).shape,

  ...VenueSchema.shape,
  ...FocalSchema.shape,
});

export type ActivityDetail = z.infer<typeof ActivityDetailSchema>;

export const ActivityCodeSchema = ActivitySchema.pick({ code: true });

export type ActivityCode = z.infer<typeof ActivityCodeSchema>;

export type ActivityUpdate = EntityUpdate<Activity>;

export type ActivityWithHonoraria = ActivityDetail & { honoraria: HonorariumInfo[] };
