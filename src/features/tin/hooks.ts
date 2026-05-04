import type { TinFormValues } from '@shared/schemas/tin';
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createTIN, fetchActiveTINs } from './api';

const QUERY_KEYS = {
  tins: ['tins'] as const,
};

export function useCreateTIN() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TinFormValues) => createTIN(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tins }),
  });
}

const getActiveTINsOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.tins,
    queryFn: fetchActiveTINs,
  });

export const useActiveTINs = () => useSuspenseQuery(getActiveTINsOptions());
