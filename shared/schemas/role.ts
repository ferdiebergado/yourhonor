import * as z from 'zod';

export const RoleSchema = z.object({
  id: z.int().positive(),
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(100, 'Role should not exceed 100 characters'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export type Role = z.infer<typeof RoleSchema>;

export const NewRoleSchema = RoleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type NewRole = z.infer<typeof NewRoleSchema>;

export const RoleBaseSchema = RoleSchema.pick({
  id: true,
  name: true,
});

export type RoleBase = z.infer<typeof RoleBaseSchema>;

export const RoleFormSchema = RoleSchema.pick({
  name: true,
});

export type RoleFormValues = z.infer<typeof RoleFormSchema>;
