import * as z from 'zod';

export const HonorariumRowSchema = z.object({
  id: z.int().positive(),
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
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export type HonorariumRow = z.infer<typeof HonorariumRowSchema>;

export const NewHonorariumSchema = HonorariumRowSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type NewHonorarium = z.infer<typeof NewHonorariumSchema>;

export const HonorariumFormSchema = HonorariumRowSchema.pick({
  activityCode: true,
  payeeId: true,
  roleId: true,
  amount: true,
  accountId: true,
  taxRate: true,
  salary: true,
});

export type HonorariumFormValues = z.infer<typeof HonorariumFormSchema>;

export const HonorariumDetailSchema = HonorariumRowSchema.pick({
  id: true,
  salary: true,
  hoursRendered: true,
  net: true,
  amount: true,
  actual: true,
  taxRate: true,
}).extend({
  bank: z.string(),
  role: z.string(),
  firstname: z.string(),
  mi: z.string(),
  lastname: z.string(),
  branch: z.string(),
  accountNumber: z.string(),
});

export type HonorariumDetail = z.infer<typeof HonorariumDetailSchema>;
