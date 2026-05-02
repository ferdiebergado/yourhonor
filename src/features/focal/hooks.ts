import { useQuery } from '@tanstack/react-query';
import { fetchFocals } from './api';

const QUERY_KEYS = {
  focals: ['focals'] as const,
};

export const useFocals = () =>
  useQuery({
    queryKey: QUERY_KEYS.focals,
    queryFn: fetchFocals,
  });
