import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAccount, fetchActiveAccounts } from './api';

const QUERY_KEYS = {
  accounts: ['accounts'] as const,
};

const getActiveAccountsOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.accounts,
    queryFn: fetchActiveAccounts,
  });

export const useActiveAccounts = () => useQuery(getActiveAccountsOptions());

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts }),
  });
}
