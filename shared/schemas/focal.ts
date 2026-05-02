import * as z from 'zod';

export const FocalSchema = z.object({
  id: z.number().int().positive(),
  firstname: z.string().min(1, 'Firstname is required'),
  mi: z.string().min(1).optional().nullable(),
  lastname: z.string().min(1, 'Lastname is required'),
  sex: z.enum(['M', 'F']),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.number().int().positive(),
  updatedBy: z.number().int().positive(),
});

export const CreateFocalSchema = FocalSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Focal = z.infer<typeof FocalSchema>;
export type CreateFocal = z.infer<typeof CreateFocalSchema>;

export const FocalIdSchema = FocalSchema.pick({ id: true });
