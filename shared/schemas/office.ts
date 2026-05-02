import * as z from 'zod';

export const OfficeSchema = z.object({
  id: z.int().positive(),
  name: z.string().min(1, 'Office name is required'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export const CreateOfficeSchema = OfficeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Office = z.infer<typeof OfficeSchema>;
export type CreateOffice = z.infer<typeof CreateOfficeSchema>;

export const OfficeIdSchema = OfficeSchema.pick({ id: true });
