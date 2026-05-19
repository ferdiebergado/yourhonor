import * as z from 'zod';

export const AccountRowSchema = z.object({
  id: z.int().positive(),
  payeeId: z.coerce.number<number>().positive('Payee is required.'),
  bankId: z.coerce.number<number>().positive('Bank is required.'),
  details: z.instanceof(ArrayBuffer),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export type AccountRow = z.infer<typeof AccountRowSchema>;

export const NewAccountSchema = AccountRowSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).extend({
  branch: z.string().min(1, 'Branch is required.'),
  accountName: z.string().min(1, 'Account name is required.'),
  accountNumber: z.string().min(1, 'Account number is required.'),
});

export type NewAccount = z.infer<typeof NewAccountSchema>;

export const AccountSchema = NewAccountSchema.pick({
  payeeId: true,
  bankId: true,
  branch: true,
  accountName: true,
  accountNumber: true,
}).extend({
  id: z.int().positive(),
});

export type Account = z.infer<typeof AccountSchema>;

export const AccountFormSchema = AccountSchema.omit({ id: true });

export type AccountFormValues = z.infer<typeof AccountFormSchema>;

export const AccountDetailRowSchema = AccountRowSchema.pick({
  id: true,
  details: true,
  payeeId: true,
  bankId: true,
}).extend({
  firstname: z.string(),
  mi: z.string().optional().nullable(),
  lastname: z.string(),
  bank: z.string(),
});

export type AccountDetailRow = z.infer<typeof AccountDetailRowSchema>;

export const AccountDetailSchema = AccountDetailRowSchema.omit({
  details: true,
}).extend({
  branch: z.string().min(1, 'Branch is required.'),
  accountName: z.string().min(1, 'Account name is required.'),
  accountNumber: z.string().min(1, 'Account number is required.'),
});

export type AccountDetail = z.infer<typeof AccountDetailSchema>;
