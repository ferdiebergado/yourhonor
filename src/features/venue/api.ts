import { api } from '@/lib/http-client';
import type { VenueFormValues, VenueItem } from '@shared/schemas/venue';

export const fetchVenues = async (): Promise<VenueItem[] | null> => await api.get('/venues');

export const createVenue = async (data: VenueFormValues): Promise<number | null> =>
  await api.post('/create-venue', data);
