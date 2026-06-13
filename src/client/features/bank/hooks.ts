import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBank, fetchActiveBanks } from './api';

const bankKeys = {
  all: ['banks'] as const,
};

export function useCreateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBank,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bankKeys.all }),
  });
}

const getActiveBanksOptions = () =>
  queryOptions({
    queryKey: bankKeys.all,
    queryFn: fetchActiveBanks,
    staleTime: 1000 * 60 * 5,
  });

export const useActiveBanks = () => useQuery(getActiveBanksOptions());
