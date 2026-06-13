import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPosition, fetchPositions } from './api';

const positionKeys = {
  all: ['positions'] as const,
};

export const fetchPositionsOptions = () =>
  queryOptions({
    queryKey: positionKeys.all,
    queryFn: fetchPositions,
    staleTime: Infinity,
  });

export const usePositions = () => useQuery(fetchPositionsOptions());

export function useCreatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPosition,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: positionKeys.all }),
  });
}
