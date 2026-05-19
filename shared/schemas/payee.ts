import * as z from 'zod';

export const PayeeSchema = z.object({
  id: z.int().positive(),
  firstname: z
    .string()
    .min(1, 'Firstname is required')
    .max(100, 'Firstname should not exceed 100 characters'),
  mi: z.string().max(3, 'Middle initial should not exceed 3 characters').optional().nullable(),
  lastname: z
    .string()
    .min(1, 'Lastname is required')
    .max(100, 'Lastname should not exceed 100 characters'),
  tin: z.string().max(15, 'TIN should not exceed 30 characters').optional().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export type Payee = z.infer<typeof PayeeSchema>;

export const NewPayeeSchema = PayeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type NewPayee = z.infer<typeof NewPayeeSchema>;

export const PayeeFormSchema = PayeeSchema.pick({
  firstname: true,
  mi: true,
  lastname: true,
  tin: true,
});

export type PayeeFormValues = z.infer<typeof PayeeFormSchema>;

export const PayeeBaseSchema = PayeeSchema.pick({
  id: true,
  firstname: true,
  mi: true,
  lastname: true,
});

export type PayeeBase = z.infer<typeof PayeeBaseSchema>;
