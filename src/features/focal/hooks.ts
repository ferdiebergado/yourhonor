import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFocal, fetchFocals } from './api';

const focalKeys = {
  all: ['focals'] as const,
};

export const fetchFocalsOptions = () =>
  queryOptions({
    queryKey: focalKeys.all,
    queryFn: fetchFocals,
    staleTime: 1000 * 60 * 5,
  });

export const useFocals = () => useQuery(fetchFocalsOptions());

export function useCreateFocal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFocal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: focalKeys.all }),
  });
}
