import { useMutation, useQueryClient } from '@tanstack/react-query';

import { activityKeys } from '@client/features/activity/hooks';
import { createHonorarium, genCert, genComp, genORS, genPayroll } from './api';

export function useCreateHonorarium() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHonorarium,
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({ queryKey: activityKeys.byCode(variables.activityCode) }),
  });
}

export const useGenCert = () => useMutation({ mutationFn: genCert });

export const useGenComp = () => useMutation({ mutationFn: genComp });

export const useGenORS = () => useMutation({ mutationFn: genORS });

export const useGenPayroll = () => useMutation({ mutationFn: genPayroll });
