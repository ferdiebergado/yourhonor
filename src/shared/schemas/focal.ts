import * as z from 'zod';
import { BaseSchema, type NewEntity } from './base';

export const FocalSchema = z.strictObject({
  ...BaseSchema.shape,
  firstname: z.string().min(1, 'Firstname is required').max(50),
  mi: z.string().max(3, 'Middle initial should not exceed 3 characters').nullish(),
  lastname: z.string().min(1, 'Lastname is required'),
  positionId: z.coerce.number<number>().positive('Position is required'),
});

export type Focal = z.infer<typeof FocalSchema>;

export type NewFocal = NewEntity<Focal>;

export const FocalFormSchema = FocalSchema.pick({
  firstname: true,
  mi: true,
  lastname: true,
  positionId: true,
});

export type FocalFormValues = z.infer<typeof FocalFormSchema>;

export const FocalDetailSchema = z.strictObject({
  ...FocalSchema.pick({
    id: true,
    firstname: true,
    mi: true,
    lastname: true,
    positionId: true,
  }).shape,

  position: z.string(),
});

export type FocalDetail = z.infer<typeof FocalDetailSchema>;
