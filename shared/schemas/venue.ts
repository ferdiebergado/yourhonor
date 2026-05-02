import * as z from 'zod';

export const VenueSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Venue name is required'),
  location: z.string().min(1, 'Location is required'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().optional().nullable(),
  createdBy: z.number().int().positive(),
  updatedBy: z.number().int().positive(),
});

export const CreateVenueSchema = VenueSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Venue = z.infer<typeof VenueSchema>;
export type CreateVenue = z.infer<typeof CreateVenueSchema>;

export const VenueIdSchema = VenueSchema.pick({ id: true });
