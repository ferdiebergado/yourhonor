import { zodResolver } from '@hookform/resolvers/zod';
import { type AccountFormValues, AccountFormSchema } from '@shared/schemas/account';
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createAccount, fetchActiveAccounts } from './api';

const accountKeys = {
  all: ['accounts'] as const,
};

const getActiveAccountsOptions = () =>
  queryOptions({
    queryKey: accountKeys.all,
    queryFn: fetchActiveAccounts,
    staleTime: 1000 * 60 * 5,
  });

export const useActiveAccounts = () => useQuery(getActiveAccountsOptions());

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountKeys.all }),
  });
}

export function useAccountForm(payeeId: number) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues: {
      payeeId,
      bankId: 0,
      branch: '',
      accountName: '',
      accountNumber: '',
    },
  });

  useEffect(() => form.setValue('payeeId', payeeId), [payeeId, form]);

  return form;
}
