import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFocal, fetchFocals } from './api';

const QUERY_KEYS = {
  focals: ['focals'] as const,
};

const fetchFocalsOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.focals,
    queryFn: fetchFocals,
  });

export const useFocals = () => useQuery(fetchFocalsOptions());

export function useCreateFocal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFocal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.focals });
    },
  });
}
