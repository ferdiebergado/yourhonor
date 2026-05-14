import { zodResolver } from '@hookform/resolvers/zod';
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { ActivityFormSchema, type ActivityFormValues } from '@shared/schemas/activity';
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

export function useActivityForm() {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(ActivityFormSchema),
    defaultValues: {
      title: '',
      code: '',
      venueId: 0,
      focalId: 0,
      startDate: '',
      endDate: '',
    },
  });

  const startDate = useWatch({ control: form.control, name: 'startDate' });
  const endDate = useWatch({ control: form.control, name: 'endDate' });

  function syncDateInputs() {
    if (!startDate && !endDate) return;

    if (startDate && !endDate) {
      form.setValue('endDate', startDate);
      form.trigger('endDate');
      return;
    }

    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) form.setValue('endDate', startDate);

      form.trigger('endDate');
      form.trigger('endDate');
      return;
    }

    if (!startDate && endDate) {
      form.setValue('startDate', endDate);
      form.trigger('startDate');
    }
  }

  useEffect(syncDateInputs, [startDate, endDate, form]);

  return form;
}
