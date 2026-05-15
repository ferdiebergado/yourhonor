import * as z from 'zod';

export const ActivityRowSchema = z.object({
  id: z.int().positive(),
  title: z
    .string()
    .min(1, 'Activity title is required')
    .max(250, 'Activity title should not exceed 250 characters'),
  venueId: z.coerce.number<number>().positive('Venue is required'),
  code: z.stringFormat(
    'activity code',
    /^AC-\d{2}-[A-Z]{2,15}-[A-Z]{2,15}-[A-Z]{2,15}-(?:P\d+|\d+-\d+|\d+)$/
  ),
  fundSource: z.string(),
  focalId: z.coerce.number<number>().positive('Focal person is required'),
  startDate: z.iso.date('Start date must be a valid date'),
  endDate: z.iso.date('End date must be a valid date'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export type ActivityRow = z.infer<typeof ActivityRowSchema>;

export const NewActivitySchema = ActivityRowSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  updatedBy: true,
});

export type NewActivity = z.infer<typeof NewActivitySchema>;

export const ActivityFormSchema = ActivityRowSchema.pick({
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

export const ActivityDetailSchema = ActivityRowSchema.omit({
  venueId: true,
  focalId: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  deletedAt: true,
}).extend({
  venue: z.string(),
  location: z.string(),
  focal: z.string(),
  focalPosition: z.string(),
});

export type ActivityDetail = z.infer<typeof ActivityDetailSchema>;

export const ActivityCodeSchema = ActivityRowSchema.pick({ code: true });

export type ActivityCode = z.infer<typeof ActivityCodeSchema>;

export const ActivityUpdateSchema = NewActivitySchema.omit({
  createdBy: true,
}).and(ActivityRowSchema.pick({ updatedBy: true }));

export type ActivityUpdate = z.infer<typeof ActivityUpdateSchema>;
