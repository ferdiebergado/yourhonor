import type { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

import RHFSelect from '@/components/rhf-select';
import { getFullName } from '@/lib/utils';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import type { PayeeBase } from '@shared/schemas/payee';

type PayeeInputProps = {
  field: ControllerRenderProps<HonorariumFormValues>;
  fieldState: ControllerFieldState;
  isLoading: boolean;
  payees: PayeeBase[];
};

export default function PayeeInput({ field, fieldState, isLoading, payees }: PayeeInputProps) {
  const items = payees.map(payee => ({
    label: getFullName(payee),
    value: payee.id.toString(),
  }));

  return <RHFSelect field={field} fieldState={fieldState} isLoading={isLoading} items={items} />;
}
