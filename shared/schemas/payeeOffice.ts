import * as z from 'zod';

export const PayeeOfficeSchema = z.object({
  id: z.int().positive(),
  payeeId: z.int().positive(),
  officeId: z.int().positive(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export const CreatePayeeOfficeSchema = PayeeOfficeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type PayeeOffice = z.infer<typeof PayeeOfficeSchema>;
export type CreatePayeeOffice = z.infer<typeof CreatePayeeOfficeSchema>;

export const PayeeOfficeIdSchema = PayeeOfficeSchema.pick({ id: true });
