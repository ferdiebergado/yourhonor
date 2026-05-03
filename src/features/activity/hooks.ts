import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createActivity, fetchActivity, fetchDetailedActivities } from './api';

const QUERY_KEYS = {
  activities: ['activities'] as const,
  activity: (id: number) => ['activities', id],
};

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activities }),
  });
}

export const useDetailedActivities = () =>
  useSuspenseQuery({
    queryKey: QUERY_KEYS.activities,
    queryFn: fetchDetailedActivities,
  });

export const useActivity = (id: number) =>
  useSuspenseQuery({
    queryKey: QUERY_KEYS.activity(id),
    queryFn: () => fetchActivity(id),
  });
