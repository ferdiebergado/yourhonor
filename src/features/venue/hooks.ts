import { useQuery } from '@tanstack/react-query';
import { fetchVenues } from './api';

const QUERY_KEYS = {
  venues: ['venues'] as const,
};

export const useVenues = () =>
  useQuery({
    queryKey: QUERY_KEYS.venues,
    queryFn: fetchVenues,
  });
