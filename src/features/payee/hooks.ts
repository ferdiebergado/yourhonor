import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPayee, fetchActivePayees } from './api';

const payeeKeys = {
  all: ['payees'] as const,
};

export function useCreatePayee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: payeeKeys.all }),
  });
}

const getActivePayeesOptions = () =>
  queryOptions({
    queryKey: payeeKeys.all,
    queryFn: fetchActivePayees,
    staleTime: 1000 * 60 * 5,
  });

export const useActivePayees = () => useQuery(getActivePayeesOptions());
