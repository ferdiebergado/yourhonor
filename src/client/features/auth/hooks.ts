import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { fetchMe, signout } from './api';

export const authKeys = {
  user: ['user'],
} as const;

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
