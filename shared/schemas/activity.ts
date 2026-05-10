import * as z from 'zod';

export const ActivityRowSchema = z.object({
  id: z.int().positive(),
  title: z.string().min(1, 'Activity title is required'),
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

export const CreateActivitySchema = ActivityRowSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Activity = z.infer<typeof ActivityRowSchema>;
export type CreateActivity = z.infer<typeof CreateActivitySchema>;

export const ActivityIdSchema = ActivityRowSchema.pick({ id: true });

export const ActivityFormSchema = ActivityRowSchema.pick({
  title: true,
  code: true,
  venueId: true,
  focalId: true,
  startDate: true,
  endDate: true,
}).superRefine(({ startDate, endDate }, ctx) => {
  if (endDate < startDate) {
    ctx.addIssue({
      code: 'invalid_value',
      values: [startDate, endDate],
      path: ['endDate'],
      message: 'End date must be on or after start date',
    });
  }
});

export type ActivityFormValues = z.infer<typeof ActivityFormSchema>;

export const ActivityDetailSchema = ActivityRowSchema.pick({
  id: true,
  title: true,
  startDate: true,
  endDate: true,
  code: true,
  fundSource: true,
}).and(
  z.object({
    venue: z.string(),
    focal: z.string(),
  })
);

export type ActivityDetail = z.infer<typeof ActivityDetailSchema>;

export const ActivityFullSchema = ActivityRowSchema.omit({
  venueId: true,
  focalId: true,
  createdBy: true,
  updatedBy: true,
}).and(
  z.object({
    venue: z.string(),
    location: z.string(),
    focal: z.string(),
    focalPosition: z.string(),
  })
);

export type ActivityFullDetail = z.infer<typeof ActivityFullSchema>;
