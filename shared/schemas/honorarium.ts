import * as z from 'zod';

export const HonorariumSchema = z.object({
  id: z.number().int().positive(),
  activityId: z.number().int().positive(),
  payeeId: z.number().int().positive(),
  roleId: z.number().int().positive(),
  amount: z.number(),
  hoursRendered: z.number(),
  actual: z.number(),
  net: z.number(),
  tinId: z.number().int().positive(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.number().int().positive(),
  updatedBy: z.number().int().positive(),
});

export const CreateHonorariumSchema = HonorariumSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Honorarium = z.infer<typeof HonorariumSchema>;
export type CreateHonorarium = z.infer<typeof CreateHonorariumSchema>;

export const HonorariumIdSchema = HonorariumSchema.pick({ id: true });
