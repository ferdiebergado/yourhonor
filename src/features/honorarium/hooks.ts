import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHonorarium } from './api';

const QUERY_KEYS = {
  honoraria: ['honoraria'] as const,
};

export function useCreateHonorarium() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHonorarium,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.honoraria }),
  });
}
