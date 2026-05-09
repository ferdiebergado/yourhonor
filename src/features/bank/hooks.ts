import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createBank, fetchActiveBanks } from './api';

const QUERY_KEYS = {
  banks: ['banks'] as const,
};

export function useCreateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBank,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.banks }),
  });
}

const getActiveBanksOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.banks,
    queryFn: fetchActiveBanks,
  });

export const useActiveBanks = () => useSuspenseQuery(getActiveBanksOptions());
