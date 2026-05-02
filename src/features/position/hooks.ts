import { useQuery } from '@tanstack/react-query';
import { fetchPositions } from './api';

const QUERY_KEYS = {
  positions: ['positions'] as const,
};

export const usePositions = () =>
  useQuery({
    queryKey: QUERY_KEYS.positions,
    queryFn: fetchPositions,
  });
