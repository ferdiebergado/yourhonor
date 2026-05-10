import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { fetchMe, signin, signout } from './api';

const QUERY_KEYS = {
  user: ['user'] as const,
};

export function useSignin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signin,
    onSuccess: user => queryClient.setQueryData(QUERY_KEYS.user, user),
  });
}

const fetchMeOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.user,
    queryFn: fetchMe,
    retry: false,
  });

export const useMe = () => useSuspenseQuery(fetchMeOptions());

export function useSignout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signout,
    onSuccess: () => {
      queryClient.cancelQueries({ queryKey: QUERY_KEYS.user });
      // eslint-disable-next-line unicorn/no-null
      queryClient.setQueryData(QUERY_KEYS.user, null);
      queryClient.removeQueries();
    },
  });
}
