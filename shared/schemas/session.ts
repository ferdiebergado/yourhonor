import * as z from 'zod';

export const SessionSchema = z.object({
  id: z.int().positive(),
  sessionId: z.string(),
  userId: z.int().positive(),
  expiresAt: z.iso.datetime(),
  isActive: z.preprocess(Boolean, z.boolean()).optional().nullable(),
  lastActiveAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
});

export type Session = z.infer<typeof SessionSchema>;

export const NewSessionSchema = SessionSchema.omit({
  id: true,
  lastActiveAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type NewSession = z.infer<typeof NewSessionSchema>;
