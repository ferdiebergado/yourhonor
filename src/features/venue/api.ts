import { api } from '@/lib/http-client';
import type { BaseVenue, VenueFormValues } from '@shared/schemas/venue';

export const fetchVenues = async () => await api.get<BaseVenue[]>('/venues');

export const createVenue = async (data: VenueFormValues): Promise<number | null> =>
  await api.post('/create-venue', data);
