import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import {
  createHonorarium,
  fetchActiveHonorariaByActivity,
  genCert,
  genComp,
  genORS,
  genPayroll,
} from './api';

const honorariumKeys = {
  all: ['honoraria'] as const,
  byCode: (code: string) => [...honorariumKeys.all, code],
};

export function useCreateHonorarium() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHonorarium,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: honorariumKeys.all }),
  });
}

const fetchActiveHonorariaOptions = (code: string) =>
  queryOptions({
    queryKey: honorariumKeys.byCode(code),
    queryFn: () => fetchActiveHonorariaByActivity(code),
  });

export const useActiveHonoraria = (code: string) =>
  useSuspenseQuery(fetchActiveHonorariaOptions(code));

export const useGenCert = () =>
  useMutation({
    mutationFn: genCert,
  });

export const useGenComp = () =>
  useMutation({
    mutationFn: genComp,
  });

export const useGenORS = () =>
  useMutation({
    mutationFn: genORS,
  });

export const useGenPayroll = () =>
  useMutation({
    mutationFn: genPayroll,
  });
