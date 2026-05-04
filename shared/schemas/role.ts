import * as z from 'zod';

export const RoleSchema = z.object({
  id: z.int().positive(),
  name: z.string().min(1, 'Role name is required'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export const CreateRoleSchema = RoleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Role = z.infer<typeof RoleSchema>;
export type CreateRole = z.infer<typeof CreateRoleSchema>;

export const RoleIdSchema = RoleSchema.pick({ id: true });

export const RoleBaseSchema = RoleSchema.pick({
  id: true,
  name: true,
});

export type RoleBase = z.infer<typeof RoleBaseSchema>;

export const RoleFormSchema = RoleSchema.pick({
  name: true,
});

export type RoleFormValues = z.infer<typeof RoleFormSchema>;
