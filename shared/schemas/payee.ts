import * as z from 'zod';
import { BaseSchema, type NewEntity } from './base';

export const PayeeSchema = z.strictObject({
  ...BaseSchema.shape,
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
});

export type Payee = z.infer<typeof PayeeSchema>;

export type NewPayee = NewEntity<Payee>;

export const PayeeFormSchema = PayeeSchema.pick({
  firstname: true,
  mi: true,
  lastname: true,
  tin: true,
});

export type PayeeFormValues = z.infer<typeof PayeeFormSchema>;

export type PayeeItem = Pick<Payee, 'id' | 'firstname' | 'mi' | 'lastname'>;
