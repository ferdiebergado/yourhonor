import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createHonorarium, fetchActiveHonorariaByActivity, genCert } from './api';

const QUERY_KEYS = {
  honoraria: ['honoraria'] as const,
  honorariaByCode: (code: string) => ['honoraria', code],
};

export function useCreateHonorarium() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHonorarium,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.honoraria }),
  });
}

const fetchActiveHonorariaOptions = (code: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.honorariaByCode(code),
    queryFn: () => fetchActiveHonorariaByActivity(code),
  });

export const useActiveHonoraria = (code: string) =>
  useSuspenseQuery(fetchActiveHonorariaOptions(code));

export const useGenCert = () =>
  useMutation({
    mutationFn: genCert,
  });
