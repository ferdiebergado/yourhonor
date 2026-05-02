import * as z from 'zod';

export const PayeeSchema = z.object({
  id: z.number().int().positive(),
  firstname: z.string().min(1, 'Firstname is required'),
  mi: z.string().min(1).optional().nullable(),
  lastname: z.string().min(1, 'Lastname is required'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.number().int().positive(),
  updatedBy: z.number().int().positive(),
});

export const CreatePayeeSchema = PayeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Payee = z.infer<typeof PayeeSchema>;
export type CreatePayee = z.infer<typeof CreatePayeeSchema>;

export const PayeeIdSchema = PayeeSchema.pick({ id: true });
