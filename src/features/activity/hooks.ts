import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createActivity } from './api';

const QUERY_KEYS = {
  activities: ['activities'] as const,
};

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activities }),
  });
}
