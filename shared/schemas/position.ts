import * as z from 'zod';

export const PositionSchema = z.object({
  id: z.int().positive('Position is required'),
  name: z
    .string()
    .min(1, 'Position is required')
    .max(100, 'Position name should not exceed 100 characters'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export const CreatePositionSchema = PositionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Position = z.infer<typeof PositionSchema>;
export type CreatePosition = z.infer<typeof CreatePositionSchema>;

export const PositionIdSchema = PositionSchema.pick({ id: true });

export const PositionBaseSchema = PositionSchema.pick({
  id: true,
  name: true,
});

export type PositionBase = z.infer<typeof PositionBaseSchema>;

export const PositionFormSchema = PositionSchema.pick({
  name: true,
});

export type PositionFormValues = z.infer<typeof PositionFormSchema>;
