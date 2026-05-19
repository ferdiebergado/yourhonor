import * as z from 'zod';

export const VenueSchema = z.object({
  id: z.int().positive(),
  name: z
    .string()
    .min(1, 'Venue name is required')
    .max(100, 'Venue should not exceed 100 characters'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location should not exceed 100 characters'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.int().positive(),
  updatedBy: z.int().positive(),
});

export type Venue = z.infer<typeof VenueSchema>;

export const NewVenueSchema = VenueSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type NewVenue = z.infer<typeof NewVenueSchema>;

export const VenueIdSchema = VenueSchema.pick({ id: true });

export const BaseVenueSchema = VenueSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  createdBy: true,
  updatedBy: true,
});

export type BaseVenue = z.infer<typeof BaseVenueSchema>;

export const VenueFormSchema = BaseVenueSchema.pick({ name: true, location: true });

export type VenueFormValues = z.infer<typeof VenueFormSchema>;
