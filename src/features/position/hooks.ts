import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPosition, fetchPositions } from './api';

const QUERY_KEYS = {
  positions: ['positions'] as const,
};

const fetchPositionsOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.positions,
    queryFn: fetchPositions,
  });

export const usePositions = () => useQuery(fetchPositionsOptions());

export function useCreatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPosition,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.positions }),
  });
}
