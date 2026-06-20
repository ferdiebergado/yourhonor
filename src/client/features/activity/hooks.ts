import { zodResolver } from '@hookform/resolvers/zod';
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect } from 'react';
import { useForm, useWatch, type UseFormReturn } from 'react-hook-form';

import {
  ActivityFormSchema,
  type ActivityFormValues,
  type ActivityWithHonoraria,
} from '@shared/schemas/activity';
import { createActivity, fetchActivities, fetchActivity, updateActivity } from './api';

export const activityKeys = {
  all: ['activities'] as const,
  byCode: (code: string) => [...activityKeys.all, { code }] as const,
};

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: activityKeys.all,
    mutationFn: createActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: activityKeys.all }),
  });
}

export const fetchActivitiesOptions = () =>
  queryOptions({
    queryKey: activityKeys.all,
    queryFn: fetchActivities,
    staleTime: Infinity,
  });

export const useActivities = () => useSuspenseQuery(fetchActivitiesOptions());

const fetchActivityOptions = (code: string) =>
  queryOptions({
    queryKey: activityKeys.byCode(code),
    queryFn: () => fetchActivity(code),
    staleTime: 60 * 10 * 1000,
  });

export const useActivity = (code: string) => useSuspenseQuery(fetchActivityOptions(code));

export function useUpdateActivity(code: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: activityKeys.byCode(code),
    mutationFn: (data: ActivityFormValues) => updateActivity(code, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: activityKeys.all }),
  });
}

// eslint-disable-next-line unicorn/no-null
export const ActivityContext = createContext<ActivityWithHonoraria | null | undefined>(null);

export function useActivityContext() {
  const context = useContext(ActivityContext);

  if (context === null)
    throw new Error('useActivityContext must be used within an ActivityProvider');

  return context;
}

export function useSyncDateInputs({
  control,
  setValue,
  trigger,
}: UseFormReturn<ActivityFormValues>) {
  const startDate = useWatch({ control, name: 'startDate' });
  const endDate = useWatch({ control, name: 'endDate' });

  function syncDateInputs() {
    if (!startDate && !endDate) return;

    if (startDate && !endDate) {
      setValue('endDate', startDate);
      trigger('endDate');
      return;
    }

    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        setValue('endDate', startDate);
        trigger('endDate');
      }

      return;
    }

    if (!startDate && endDate) {
      setValue('startDate', endDate);
      trigger('startDate');
    }
  }

  useEffect(syncDateInputs, [startDate, endDate, control, setValue, trigger]);
}

export function useActivityForm(values?: ActivityFormValues) {
  const defaultvalues = {
    title: '',
    startDate: '',
    endDate: '',
    venueId: 0,
    code: '',
    focalId: 0,
  };

  return useForm<ActivityFormValues>({
    resolver: zodResolver(ActivityFormSchema),
    defaultValues: values ?? defaultvalues,
  });
}
