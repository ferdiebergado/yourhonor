import * as z from 'zod';

export const FocalPositionSchema = z.object({
  id: z.number().int().positive(),
  focalId: z.number().int().positive(),
  positionId: z.number().int().positive(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.number().int().positive(),
  updatedBy: z.number().int().positive(),
});

export const CreateFocalPositionSchema = FocalPositionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type FocalPosition = z.infer<typeof FocalPositionSchema>;
export type CreateFocalPosition = z.infer<typeof CreateFocalPositionSchema>;

export const FocalPositionIdSchema = FocalPositionSchema.pick({ id: true });
