import * as z from 'zod';

export const AccountRowSchema = z.object({
  id: z.int().positive(),
  payeeId: z.coerce.number<number>().positive('Payee is required.'),
  bankId: z.coerce.number<number>().positive('Bank is required.'),
  branch: z.string().min(1, 'Branch is required.'),
  accountNumber: z.string().min(1, 'Account number is required.'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export type AccountRow = z.infer<typeof AccountRowSchema>;

export const NewAccountRowSchema = AccountRowSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type NewAccountRow = z.infer<typeof NewAccountRowSchema>;

export const AccountSchema = AccountRowSchema.pick({
  id: true,
  payeeId: true,
  bankId: true,
  branch: true,
  accountNumber: true,
});

export type Account = z.infer<typeof AccountSchema>;

export const AccountFormSchema = AccountSchema.omit({ id: true });

export type AccountFormValues = z.infer<typeof AccountFormSchema>;

export const AccountDetailSchema = AccountSchema.extend({
  firstname: z.string(),
  mi: z.string().optional().nullable(),
  lastname: z.string(),
  bank: z.string(),
});

export type AccountDetail = z.infer<typeof AccountDetailSchema>;
