import * as z from 'zod';

const EntityIDSchema = z.object({
  id: z.int().positive(),
});

export type EntityID = z.infer<typeof EntityIDSchema>;

const AuditFieldsSchema = z.strictObject({
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().nullish(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export type AuditFields = z.infer<typeof AuditFieldsSchema>;

export const BaseSchema = z.strictObject({
  ...EntityIDSchema.shape,
  ...AuditFieldsSchema.shape,
});

export type Entity = z.infer<typeof BaseSchema>;

export type NewEntity<T extends Entity> = Omit<T, 'id' | Exclude<keyof AuditFields, 'createdBy'>>;

export type EntityUpdate<T extends Entity> = Omit<NewEntity<T>, 'createdBy'> & Pick<T, 'updatedBy'>;
