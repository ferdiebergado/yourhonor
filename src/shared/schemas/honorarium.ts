import * as z from 'zod';

import { AccountSchema } from './account';
import { BaseSchema, type EntityUpdate, type NewEntity } from './base';
import { PayeeFormSchema } from './payee';

export const HonorariumSchema = z.strictObject({
  ...BaseSchema.shape,

  activityCode: z.string().min(1, 'Activity code is required.'),
  payeeId: z.coerce.number<number>().positive('Payee is required.'),
  roleId: z.coerce.number<number>().positive('Role is required.'),
  salary: z.coerce.number<number>().positive('Salary is required.'),
  amount: z.coerce.number<number>().positive('Amount is required.'),
  taxRate: z.coerce.number<number>().positive('Tax rate is required.'),
  hoursRendered: z.coerce.number<number>().positive('Hours rendered is required.'),
  actual: z.number(),
  net: z.number(),
  accountId: z.coerce.number<number>().positive('Bank account is required.'),
});

export type Honorarium = z.infer<typeof HonorariumSchema>;

export type NewHonorarium = NewEntity<Honorarium>;

export const HonorariumFormSchema = HonorariumSchema.pick({
  activityCode: true,
  payeeId: true,
  roleId: true,
  amount: true,
  accountId: true,
  taxRate: true,
  salary: true,
});

export type HonorariumFormValues = z.infer<typeof HonorariumFormSchema>;

const PayeeSchema = PayeeFormSchema.omit({ tin: true });

export const HonorariumDetailSchema = z.strictObject({
  ...HonorariumSchema.pick({
    id: true,
    salary: true,
    hoursRendered: true,
    net: true,
    amount: true,
    actual: true,
    taxRate: true,
  }).shape,

  ...PayeeSchema.shape,
  ...AccountSchema.pick({
    bankBranch: true,
    accountName: true,
    accountNoMasked: true,
    accountNo: true,
  }).shape,
  bank: z.string(),
  role: z.string(),
  tin: z.string().nullish(),
});

export type HonorariumDetail = z.infer<typeof HonorariumDetailSchema>;

export type HonorariumDetailSafe = Omit<HonorariumDetail, 'accountNo'>;

export type HonorariumUpdate = EntityUpdate<Honorarium>;

export const HonorariumIdSchema = z.object({
  id: z.coerce.number<number>().positive(),
});

export const HonorariumInfoSchema = HonorariumDetailSchema.omit({
  bank: true,
  bankBranch: true,
  accountName: true,
  accountNo: true,
  accountNoMasked: true,
  tin: true,
});

export type HonorariumInfo = z.infer<typeof HonorariumInfoSchema>;
