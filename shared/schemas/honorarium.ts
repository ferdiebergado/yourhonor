import * as z from 'zod';

export const HonorariumSchema = z.object({
  id: z.int().positive(),
  activityId: z.int().positive(),
  payeeId: z.coerce.number<number>().positive('Payee is required.'),
  roleId: z.coerce.number<number>().positive('Role is required'),
  amount: z.coerce.number<number>().positive('Amount is required'),
  hoursRendered: z.coerce.number<number>().positive('Hours rendered is required'),
  actual: z.number(),
  net: z.number(),
  accountId: z.coerce.number<number>().positive('Bank account is required.'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export const CreateHonorariumSchema = HonorariumSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Honorarium = z.infer<typeof HonorariumSchema>;
export type CreateHonorarium = z.infer<typeof CreateHonorariumSchema>;

export const HonorariumFormSchema = HonorariumSchema.pick({
  activityId: true,
  payeeId: true,
  roleId: true,
  amount: true,
  hoursRendered: true,
  accountId: true,
});

export type HonorariumFormValues = z.infer<typeof HonorariumFormSchema>;
