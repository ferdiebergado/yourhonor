import * as z from 'zod';

export const ActivitySchema = z.object({
  id: z.int().positive(),
  title: z.string().min(1, 'Activity title is required'),
  venueId: z.int().positive(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  code: z.string().min(1, 'Activity code is required'),
  fundSource: z.string().min(1, 'Fund source is required'),
  focalId: z.int().positive(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export const CreateActivitySchema = ActivitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Activity = z.infer<typeof ActivitySchema>;
export type CreateActivity = z.infer<typeof CreateActivitySchema>;

export const ActivityIdSchema = ActivitySchema.pick({ id: true });

export const ActivityFormSchema = z
  .object({
    title: z.string().min(1, 'Activity title is required'),
    code: z.string().min(1, 'Activity code is required'),
    venueId: z.coerce.number<number>().positive('Venue is required'),
    focalId: z.coerce.number<number>().positive('Focal person is required'),
    startDate: z.iso.date('Start date must be a valid date'),
    endDate: z.iso.date('End date must be a valid date'),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
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

export const ActivityDetailSchema = ActivitySchema.pick({
  title: true,
  startDate: true,
  endDate: true,
  code: true,
}).and(
  z.object({
    venue: z.string(),
    focal: z.string(),
  })
);

export type ActivityDetail = z.infer<typeof ActivityDetailSchema>;
