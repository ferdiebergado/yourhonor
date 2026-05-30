import * as z from 'zod';

export const UserSchema = z.strictObject({
  id: z.int().positive(),

  // Basic Profile
  googleId: z.string().min(1, 'Google ID is required'),
  email: z.email('Invalid email address').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  picture: z.url('Invalid URL format').optional(),

  // Permissions
  role: z.enum(['user', 'admin']).optional(),

  isActive: z.preprocess(Boolean, z.boolean()).optional(),

  // Timestamps (ISO 8601 Strings)
  lastLoginAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

export type User = z.infer<typeof UserSchema>;

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>;

export type Profile = Pick<User, 'name' | 'email' | 'picture'>;
