import * as z from 'zod';

import { BaseSchema, type AuditFields, type NewEntity } from './base';

const plainAccountNoSchema = z.string().min(1, 'Account number is required.');

export const AccountSchema = z.strictObject({
  ...BaseSchema.shape,
  payeeId: z.coerce.number<number>().positive('Payee is required.'),
  bankId: z.coerce.number<number>().positive('Bank name is required.'),
  bankBranch: z.string().min(1, 'Bank branch is required.'),
  accountName: z.string().min(1, 'Account name is required.'),
  accountNo: z.instanceof(ArrayBuffer),
  accountNoLast4: z.string().min(1).max(4),
  accountNoMasked: z.string(),
});

export type Account = z.infer<typeof AccountSchema>;

export type NewAccount = NewEntity<Account>;

export const AccountFormSchema = z.strictObject({
  ...AccountSchema.pick({
    payeeId: true,
    bankId: true,
    bankBranch: true,
    accountName: true,
  }).shape,
  accountNo: plainAccountNoSchema,
});

export type AccountFormValues = z.infer<typeof AccountFormSchema>;

export type AccountDetail = Omit<Account, keyof AuditFields | 'accountNo'> & {
  firstname: string;
  mi?: string;
  lastname: string;
  bank: string;
};
