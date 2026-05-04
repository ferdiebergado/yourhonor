import * as z from 'zod';

export const TinSchema = z.object({
  id: z.int().positive(),
  payeeId: z.coerce.number<number>().positive('Payee is required.'),
  tin: z.string().min(1, 'TIN is required'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
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

export type TinId = z.infer<typeof TinIdSchema>;

export const TinBaseSchema = TinSchema.pick({
  id: true,
  payeeId: true,
  tin: true,
});

export type TinBase = z.infer<typeof TinBaseSchema>;

export const TinFormSchema = TinBaseSchema.omit({
  id: true,
});

export type TinFormValues = z.infer<typeof TinFormSchema>;
