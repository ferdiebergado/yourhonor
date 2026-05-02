import * as z from 'zod';

export const HonorariumSchema = z.object({
  id: z.int().positive(),
  activityId: z.int().positive(),
  payeeId: z.int().positive(),
  roleId: z.int().positive(),
  amount: z.number(),
  hoursRendered: z.number(),
  actual: z.number(),
  net: z.number(),
  tinId: z.int().positive(),
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

export const HonorariumIdSchema = HonorariumSchema.pick({ id: true });
