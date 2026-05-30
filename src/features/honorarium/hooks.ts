import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { activityKeys } from '@/features/activity/hooks';
import { type HonorariumFormValues, HonorariumFormSchema } from '@shared/schemas/honorarium';
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

export function useHonorariumForm(activityCode: string) {
  const form = useForm<HonorariumFormValues>({
    resolver: zodResolver(HonorariumFormSchema),
    defaultValues: {
      activityCode,
      payeeId: 0,
      roleId: 0,
      amount: 0,
      accountId: 0,
      taxRate: 10,
      salary: 0,
    },
  });

  const payeeId = useWatch({ control: form.control, name: 'payeeId' });
  const honorarium = useWatch({ control: form.control, name: 'amount' });
  const taxRate = useWatch({ control: form.control, name: 'taxRate' });
  const salary = useWatch({ control: form.control, name: 'salary' });

  useEffect(() => form.setValue('activityCode', activityCode), [activityCode, form]);
  useEffect(() => form.setValue('accountId', 0), [payeeId, form]);

  return {
    form,
    honorarium,
    taxRate,
    salary,
    payeeId,
  };
}
