import type { PayeeFormValues } from '@shared/schemas/payee';
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createPayee, fetchActivePayees } from './api';

const QUERY_KEYS = {
  payees: ['payees'] as const,
};

export function useCreatePayee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PayeeFormValues) => createPayee(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payees }),
  });
}

const getActivePayeesOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.payees,
    queryFn: fetchActivePayees,
  });

export const useActivePayees = () => useSuspenseQuery(getActivePayeesOptions());
