import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { createActivity, fetchActivity, fetchDetailedActivities } from './api';

const QUERY_KEYS = {
  activities: ['activities'] as const,
  activity: (code: string) => ['activities', code],
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

export const useActivity = (code: string) =>
  useSuspenseQuery({
    queryKey: QUERY_KEYS.activity(code),
    queryFn: () => fetchActivity(code),
  });

export type ActivityState = {
  id: number;
};

export const ActivityCodeContext = createContext<string | undefined>(undefined);

export function useActivityCode() {
  const activityCodeContext = useContext(ActivityCodeContext);

  if (activityCodeContext === undefined)
    throw new Error('useActivityCode must be used inside an ActivityProvider');

  return activityCodeContext;
}
