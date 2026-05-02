import * as z from 'zod';

export const FocalSchema = z.object({
  id: z.int().positive(),
  firstname: z.string().min(1, 'Firstname is required'),
  mi: z.string().optional().nullable(),
  lastname: z.string().min(1, 'Lastname is required'),
  sex: z.enum(['M', 'F']),
  positionId: z.int().positive('Position is required'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
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

export const FocalBaseSchema = FocalSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  createdBy: true,
  updatedBy: true,
}).and(
  z.object({
    position: z.string().min(1, 'Position is required'),
  })
);

export type FocalBase = z.infer<typeof FocalBaseSchema>;

export const FocalFormSchema = FocalSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  createdBy: true,
  updatedBy: true,
});

export type FocalFormValues = z.infer<typeof FocalFormSchema>;
