import * as z from 'zod';

export const PayeeBankAccountSchema = z.object({
  id: z.int().positive(),
  payeeId: z.int().positive(),
  bankId: z.int().positive(),
  branch: z.string().min(1, 'Branch is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export const CreatePayeeBankAccountSchema = PayeeBankAccountSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type PayeeBankAccount = z.infer<typeof PayeeBankAccountSchema>;
export type CreatePayeeBankAccount = z.infer<typeof CreatePayeeBankAccountSchema>;

export const PayeeBankAccountIdSchema = PayeeBankAccountSchema.pick({ id: true });
