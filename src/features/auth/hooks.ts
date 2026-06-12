import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { fetchSummaryOptions } from '@/app/hooks';
import { fetchMe, signin, signout } from './api';

export const authKeys = Object.freeze({
  user: ['user'] as const,
} as const);

export function useSignin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signin,
    onSuccess: user => {
      queryClient.setQueryData(authKeys.user, user);
      queryClient.prefetchQuery(fetchSummaryOptions());
    },
  });
}

const fetchMeOptions = () =>
  queryOptions({
    queryKey: authKeys.user,
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

export const useMe = () => useSuspenseQuery(fetchMeOptions());

export function useSignout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signout,
    onSuccess: () => {
      queryClient.cancelQueries({ queryKey: authKeys.user });
      // eslint-disable-next-line unicorn/no-null
      queryClient.setQueryData(authKeys.user, null);
      queryClient.removeQueries();
    },
  });
}
