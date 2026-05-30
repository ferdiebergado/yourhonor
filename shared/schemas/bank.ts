import * as z from 'zod';
import { BaseSchema, type NewEntity } from './base';

export const BankSchema = z.strictObject({
  ...BaseSchema.shape,
  name: z
    .string()
    .min(1, 'Bank name is required')
    .max(150, 'Bank name should not exceed 150 characters'),
});

export type Bank = z.infer<typeof BankSchema>;

export type NewBank = NewEntity<Bank>;

export const BankFormSchema = BankSchema.pick({ name: true });

export type BankFormValues = z.infer<typeof BankFormSchema>;

export type BankItem = Pick<Bank, 'id' | 'name'>;
