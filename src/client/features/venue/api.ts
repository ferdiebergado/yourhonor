import { api } from '@client/lib/http-client';
import type { VenueFormValues, VenueItem } from '@shared/schemas/venue';

const BASE_URL = '/venues' as const;

export const fetchVenues = async (): Promise<VenueItem[] | null> => await api.get(BASE_URL);

export const createVenue = async (data: VenueFormValues): Promise<number | null> =>
  await api.post(BASE_URL, data);
