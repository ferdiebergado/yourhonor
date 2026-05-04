import type { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

import RHFSelect from '@/components/rhf-select';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import type { RoleBase } from '@shared/schemas/role';

type RoleInputProps = {
  field: ControllerRenderProps<HonorariumFormValues>;
  fieldState: ControllerFieldState;
  isLoading: boolean;
  roles: RoleBase[];
};

export default function RoleInput({ field, fieldState, isLoading, roles }: RoleInputProps) {
  const items = roles.map(role => ({
    label: role.name,
    value: role.id.toString(),
  }));

  return <RHFSelect field={field} fieldState={fieldState} isLoading={isLoading} items={items} />;
}
