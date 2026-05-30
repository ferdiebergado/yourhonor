import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { activityKeys } from '@/features/activity/hooks';
import { type Honorarium, type HonorariumFormValues } from '@shared/schemas/honorarium';
import type { Payee } from '@shared/schemas/payee';
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

type HonorariumFormState = {
  form: UseFormReturn<HonorariumFormValues>;
  payeeId: Payee['id'];
  honorarium: Honorarium['amount'];
  taxRate: Honorarium['taxRate'];
  salary: Honorarium['salary'];
  isAccountFormOpen: boolean;
  setIsAccountFormOpen: Dispatch<SetStateAction<boolean>>;
  isPayeeFormOpen: boolean;
  setIsPayeeFormOpen: Dispatch<SetStateAction<boolean>>;
  isRoleFormOpen: boolean;
  setIsRoleFormOpen: Dispatch<SetStateAction<boolean>>;
};

export const HonorariumFormContext = createContext<HonorariumFormState | undefined>(undefined);

export function useHonorariumFormContext() {
  const context = useContext(HonorariumFormContext);

  if (!context)
    throw new Error('useHonorariumFormContext must be used inside a HonorariumFormProvider');

  return context;
}
