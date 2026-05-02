import type { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FocalFormValues } from '@shared/schemas/focal';
import type { PositionBase } from '@shared/schemas/position';

type PositionInputProps = {
  field: ControllerRenderProps<FocalFormValues>;
  fieldState: ControllerFieldState;
  isLoading: boolean;
  positions: PositionBase[];
};

export default function PositionInput({
  field,
  fieldState,
  isLoading,
  positions,
}: PositionInputProps) {
  const items = positions.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <Select items={items} name={field.name} value={field.value} onValueChange={field.onChange}>
      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
        <SelectValue placeholder={isLoading ? 'Loading...' : 'Select a position'} />
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
