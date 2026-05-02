import * as z from 'zod';

export const ActivitySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, 'Activity title is required'),
  venueId: z.number().int().positive(),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  code: z.string().min(1, 'Activity code is required'),
  fundSource: z.string().min(1, 'Fund source is required'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.number().int().positive(),
  updatedBy: z.number().int().positive(),
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
