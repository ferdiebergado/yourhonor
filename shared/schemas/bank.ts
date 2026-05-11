import * as z from 'zod';

export const BankSchema = z.object({
  id: z.int().positive(),
  name: z
    .string()
    .min(1, 'Bank name is required')
    .max(150, 'Bank name should not exceed 150 characters'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export const CreateBankSchema = BankSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Bank = z.infer<typeof BankSchema>;
export type CreateBank = z.infer<typeof CreateBankSchema>;

export const BankIdSchema = BankSchema.pick({ id: true });

export const BankBaseSchema = BankSchema.pick({
  id: true,
  name: true,
});

export type BankBase = z.infer<typeof BankBaseSchema>;

export const BankFormSchema = BankSchema.pick({ name: true });

export type BankFormValues = z.infer<typeof BankFormSchema>;
