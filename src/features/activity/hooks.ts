import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';

import { createActivity, fetchActivities, fetchActivity } from './api';

const activityKeys = {
  all: ['activities'] as const,
  byCode: (code: string) => [...activityKeys.all, code] as const,
};

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: activityKeys.all }),
  });
}

const fetchActivitiesOptions = () =>
  queryOptions({
    queryKey: activityKeys.all,
    queryFn: fetchActivities,
  });

export const useActivities = () => useSuspenseQuery(fetchActivitiesOptions());

const fetchActivityOptions = (code: string) =>
  queryOptions({
    queryKey: activityKeys.byCode(code),
    queryFn: () => fetchActivity(code),
  });

export const useActivity = (code: string) => useSuspenseQuery(fetchActivityOptions(code));

export const ActivityCodeContext = createContext<string | undefined>(undefined);

export function useActivityCode() {
  const activityCodeContext = useContext(ActivityCodeContext);

  if (activityCodeContext === undefined)
    throw new Error('useActivityCode must be used inside an ActivityProvider');

  return activityCodeContext;
}
