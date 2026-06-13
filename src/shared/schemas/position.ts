import * as z from 'zod';
import { BaseSchema, type NewEntity } from './base';

export const PositionSchema = z.strictObject({
  ...BaseSchema.shape,
  name: z
    .string()
    .min(1, 'Position is required')
    .max(100, 'Position name should not exceed 100 characters'),
});

export type Position = z.infer<typeof PositionSchema>;

export type NewPosition = NewEntity<Position>;

export const PositionFormSchema = PositionSchema.pick({
  name: true,
});

export type PositionFormValues = z.infer<typeof PositionFormSchema>;

export type PositionItem = Pick<Position, 'id' | 'name'>;
