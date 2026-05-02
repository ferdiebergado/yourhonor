import * as z from 'zod';

export const TinSchema = z.object({
  id: z.number().int().positive(),
  payeeId: z.number().int().positive(),
  tinNumber: z.string().min(1, 'TIN number is required'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.number().int().positive(),
  updatedBy: z.number().int().positive(),
});

export const CreateTinSchema = TinSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Tin = z.infer<typeof TinSchema>;
export type CreateTin = z.infer<typeof CreateTinSchema>;

export const TinIdSchema = TinSchema.pick({ id: true });
