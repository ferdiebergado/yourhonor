import { api } from '@/lib/http-client';
import type { BaseVenue } from '@shared/schemas/venue';

export const fetchVenues = async () => await api.get<BaseVenue[]>('/venues');
