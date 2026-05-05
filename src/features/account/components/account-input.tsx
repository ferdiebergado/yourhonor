import type { ComponentProps } from 'react';

import GenericCombobox from '@/components/ui/generic-combobox';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import type { AccountBase } from '@shared/schemas/account';

type AccountInputProps<T> = {
  accounts: T[];
  value?: T | null;
  onValueChange?: (value: T | null) => void;
} & Omit<ComponentProps<'input'>, 'value' | 'onChange'>;

export default function AccountInput({
  accounts = [],
  value,
  onValueChange,
  ...props
}: AccountInputProps<AccountBase>) {
  return (
    <GenericCombobox<AccountBase>
      items={accounts}
      itemToStringLabel={item => item.accountNumber}
      itemToStringValue={item => item.id.toString()}
      value={value}
      onValueChange={onValueChange}
      comboboxInputProps={props}
      renderItem={item => (
        <Item size="xs" className="p-0">
          <ItemContent>
            <ItemTitle className="whitespace-nowrap">{item.accountNumber}</ItemTitle>
            <ItemDescription>{item.bankId}</ItemDescription>
          </ItemContent>
        </Item>
      )}
    />
  );
}
