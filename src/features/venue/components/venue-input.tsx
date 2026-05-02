import GenericCombobox from '@/components/ui/generic-combobox';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { type BaseVenue } from '@shared/schemas/venue';
import type { ComponentProps } from 'react';

type VenueInputProps<T = BaseVenue> = {
  venues: T[];
  value?: T | null;
  onValueChange?: (value: T | null) => void;
} & Omit<ComponentProps<'input'>, 'value' | 'onChange'>;

export default function VenueInput({
  venues = [],
  value,
  onValueChange,
  ...props
}: VenueInputProps) {
  return (
    <GenericCombobox<BaseVenue>
      items={venues}
      itemToStringLabel={item => item.name}
      itemToStringValue={item => item.id.toString()}
      value={value}
      onValueChange={onValueChange}
      comboboxInputProps={props}
      renderItem={item => (
        <Item size="xs" className="p-0">
          <ItemContent>
            <ItemTitle className="whitespace-nowrap">{item.name}</ItemTitle>
            <ItemDescription>{item.location}</ItemDescription>
          </ItemContent>
        </Item>
      )}
    />
  );
}
