import * as z from 'zod';
import { BaseSchema, type NewEntity } from './base';

export const VenueSchema = z.strictObject({
  ...BaseSchema.shape,

  name: z
    .string()
    .min(1, 'Venue name is required')
    .max(100, 'Venue should not exceed 100 characters'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location should not exceed 100 characters'),
});

export type Venue = z.infer<typeof VenueSchema>;

export type NewVenue = NewEntity<Venue>;

export const VenueFormSchema = VenueSchema.pick({
  name: true,
  location: true,
});

export type VenueFormValues = z.infer<typeof VenueFormSchema>;

export type VenueItem = Pick<Venue, 'id' | 'name' | 'location'>;
