import * as z from 'zod';
import { BaseSchema, type NewEntity } from './base';

const RoleSchema = z.strictObject({
  ...BaseSchema.shape,
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(100, 'Role should not exceed 100 characters'),
});

export type Role = z.infer<typeof RoleSchema>;

export type NewRole = NewEntity<Role>;

export const RoleFormSchema = RoleSchema.pick({
  name: true,
});

export type RoleFormValues = z.infer<typeof RoleFormSchema>;

export type RoleItem = Pick<Role, 'id' | 'name'>;
