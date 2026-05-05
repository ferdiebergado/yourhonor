import * as z from 'zod';

export const AccountSchema = z.object({
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

export const CreateAccountSchema = AccountSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Account = z.infer<typeof AccountSchema>;
export type CreateAccount = z.infer<typeof CreateAccountSchema>;

export const AccountIdSchema = AccountSchema.pick({ id: true });

export const AccountBaseSchema = AccountSchema.pick({
  id: true,
  payeeId: true,
  bankId: true,
  branch: true,
  accountNumber: true,
});

export type AccountBase = z.infer<typeof AccountBaseSchema>;

export const AccountFormSchema = AccountBaseSchema.omit({ id: true });

export type AccountFormValues = z.infer<typeof AccountFormSchema>;
