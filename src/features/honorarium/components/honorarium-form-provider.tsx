import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactNode } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import type { Activity } from '@shared/schemas/activity';
import { HonorariumFormSchema, type HonorariumFormValues } from '@shared/schemas/honorarium';
import { HonorariumFormContext } from '../hooks';

type HonorariumFormProviderProps = {
  activityCode: Activity['code'];
  children: ReactNode;
};

export default function HonorariumFormProvider({
  activityCode,
  children,
}: HonorariumFormProviderProps) {
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [isPayeeFormOpen, setIsPayeeFormOpen] = useState(false);
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);

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

  const { control } = form;

  const payeeId = useWatch({ control, name: 'payeeId' });
  const honorarium = useWatch({ control, name: 'amount' });
  const taxRate = useWatch({ control, name: 'taxRate' });
  const salary = useWatch({ control, name: 'salary' });

  useEffect(() => form.setValue('activityCode', activityCode), [activityCode, form]);
  useEffect(() => form.setValue('accountId', 0), [payeeId, form]);

  const value = {
    form,
    payeeId,
    honorarium,
    taxRate,
    salary,
    isAccountFormOpen,
    setIsAccountFormOpen,
    isPayeeFormOpen,
    setIsPayeeFormOpen,
    isRoleFormOpen,
    setIsRoleFormOpen,
  };

  return <HonorariumFormContext value={value}>{children}</HonorariumFormContext>;
}
