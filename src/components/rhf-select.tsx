import type { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';

type Item = {
  label: string;
  value: string;
};

type RHFSelectProps = {
  field: ControllerRenderProps<HonorariumFormValues>;
  fieldState: ControllerFieldState;
  isLoading: boolean;
  items: Item[];
  placeholder?: string;
};

export default function RHFSelect({
  field,
  fieldState,
  isLoading,
  items,
  placeholder,
}: RHFSelectProps) {
  return (
    <Select
      items={items}
      name={field.name}
      value={field.value === 0 ? '' : field.value?.toString()}
      onValueChange={field.onChange}
    >
      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
        <SelectValue placeholder={(placeholder ?? isLoading) ? 'Loading...' : 'Select payee'} />
      </SelectTrigger>
      <SelectContent>
        {items.map(item => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
