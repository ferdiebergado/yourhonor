import GenericCombobox from '@/components/ui/generic-combobox';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import type { FocalBase } from '@shared/schemas/focal';
import type { ComponentProps } from 'react';

const getFullName = (focal: FocalBase) =>
  `${focal.firstname} ${focal.mi ? focal.mi + '. ' : ''}${focal.lastname}`;

type FocalInputProps<T = FocalBase> = {
  focals: T[];
  value?: T | null;
  onValueChange?: (value: T | null) => void;
} & Omit<ComponentProps<'input'>, 'value' | 'onChange'>;

export default function FocalInput({
  focals = [],
  value,
  onValueChange,
  ...props
}: FocalInputProps) {
  return (
    <GenericCombobox<FocalBase>
      items={focals}
      itemToStringLabel={item => getFullName(item)}
      itemToStringValue={item => item.id.toString()}
      value={value}
      onValueChange={onValueChange}
      comboboxInputProps={props}
      renderItem={item => (
        <Item size="xs" className="p-0">
          <ItemContent>
            <ItemTitle className="whitespace-nowrap">{getFullName(item)}</ItemTitle>
            <ItemDescription>{item.position}</ItemDescription>
          </ItemContent>
        </Item>
      )}
    />
  );
}
