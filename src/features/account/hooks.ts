import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAccount, fetchActiveAccounts } from './api';

const accountKeys = {
  all: ['accounts'] as const,
};

const getActiveAccountsOptions = () =>
  queryOptions({
    queryKey: accountKeys.all,
    queryFn: fetchActiveAccounts,
  });

export const useActiveAccounts = () => useQuery(getActiveAccountsOptions());

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountKeys.all }),
  });
}
