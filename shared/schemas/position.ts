import * as z from 'zod';

export const PositionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Position name is required'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.number().int().positive(),
  updatedBy: z.number().int().positive(),
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
