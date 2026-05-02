import * as z from 'zod';

export const SessionSchema = z.object({
  id: z.int().positive(),
  sessionId: z.string(),
  userId: z.int().positive(),
  expiresAt: z.iso.datetime().transform(value => new Date(value)),
  isActive: z.preprocess(Boolean, z.boolean()).optional().nullable(),
  lastActiveAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
});

export type Session = z.infer<typeof SessionSchema>;

export const CreateSessionSchema = SessionSchema.omit({
  id: true,
  lastActiveAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type CreateSession = z.infer<typeof CreateSessionSchema>;
