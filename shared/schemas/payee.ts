import * as z from 'zod';

export const PayeeSchema = z.object({
  id: z.int().positive(),
  firstname: z.string().min(1, 'Firstname is required'),
  mi: z.string().optional().nullable(),
  lastname: z.string().min(1, 'Lastname is required'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
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

export const PayeeFormSchema = PayeeSchema.pick({
  firstname: true,
  mi: true,
  lastname: true,
});

export type PayeeFormValues = z.infer<typeof PayeeFormSchema>;

export const PayeeBaseSchema = PayeeSchema.pick({
  id: true,
  firstname: true,
  mi: true,
  lastname: true,
});

export type PayeeBase = z.infer<typeof PayeeBaseSchema>;
