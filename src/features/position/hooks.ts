import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPosition, fetchPositions } from './api';

const QUERY_KEYS = {
  positions: ['positions'] as const,
};

export const usePositions = () =>
  useQuery({
    queryKey: QUERY_KEYS.positions,
    queryFn: fetchPositions,
  });

export function useCreatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.positions });
    },
  });
}
