import { useIsMutating } from '@tanstack/react-query';
import { Controller, type FieldValues, type UseFormReturn } from 'react-hook-form';

import FormButtons from '@client/components/form-buttons';
import GenericCombobox from '@client/components/generic-combobox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@client/components/ui/field';
import { Input } from '@client/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@client/components/ui/item';
import { Textarea } from '@client/components/ui/textarea';
import AddFocalDialog from '@client/features/focal/components/add-focal-dialog';
import { useFocals } from '@client/features/focal/hooks';
import AddVenueDialog from '@client/features/venue/components/add-venue-dialog';
import { useVenues } from '@client/features/venue/hooks';
import { type ActivityFormValues } from '@shared/schemas/activity';
import { getFullName } from '@shared/utils';
import { activityKeys, useSyncDateInputs } from '../hooks';

type ActivityFormProps<T extends FieldValues = ActivityFormValues> = {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
};

export default function ActivityForm({ form, onSubmit }: ActivityFormProps) {
  const { isLoading: isFetchingVenues, data: venues } = useVenues();
  const { isLoading: isFetchingFocals, data: focals } = useFocals();

  const isMutating = useIsMutating({ mutationKey: activityKeys.all }) > 0;

  useSyncDateInputs(form);

  return (
    <form className="space-y-6">
      <FieldGroup>
        {/* Title */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Title</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Lesson Exemplars on Biology (Development Phase)"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                className="h-30"
                autoFocus
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Venue */}
        <Controller
          name="venueId"
          control={form.control}
          render={({ field, fieldState }) => {
            // eslint-disable-next-line unicorn/no-null
            const selectedVenue = venues?.find(venue => venue.id === field.value) ?? null;

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Venue</FieldLabel>
                <div className="flex gap-2">
                  <GenericCombobox
                    id={field.name}
                    className="flex-1"
                    items={venues ?? []}
                    aria-invalid={fieldState.invalid}
                    placeholder={isFetchingVenues ? 'Loading venues…' : 'Select a venue'}
                    itemToStringLabel={item => item.name}
                    itemToStringValue={item => item.id.toString()}
                    value={selectedVenue}
                    onValueChange={venue => field.onChange(venue?.id ?? 0)}
                    renderItem={item => (
                      <Item size="xs" className="p-0">
                        <ItemContent>
                          <ItemTitle className="whitespace-nowrap">{item.name}</ItemTitle>
                          <ItemDescription>{item.location}</ItemDescription>
                        </ItemContent>
                      </Item>
                    )}
                    disabled={isFetchingVenues}
                  />

                  <AddVenueDialog activityForm={form} />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Start Date */}
          <Controller
            name="startDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                <Input {...field} id={field.name} type="date" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* End Date */}
          <Controller
            name="endDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>End Date</FieldLabel>
                <Input {...field} id={field.name} type="date" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="flex gap-4">
          {/* Activity Code */}
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Activity Code</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="AC-26-BLD-TLD-BEC-001"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Focal Person */}
          <Controller
            name="focalId"
            control={form.control}
            render={({ field, fieldState }) => {
              // eslint-disable-next-line unicorn/no-null
              const selectedFocal = focals?.find(focal => focal.id === field.value) ?? null;

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Focal Person</FieldLabel>
                  <div className="flex gap-2">
                    <GenericCombobox
                      id={field.name}
                      className="flex-1"
                      aria-invalid={fieldState.invalid}
                      items={focals ?? []}
                      itemToStringLabel={item => getFullName(item)}
                      itemToStringValue={item => item.id.toString()}
                      value={selectedFocal}
                      onValueChange={focal => field.onChange(focal?.id ?? 0)}
                      placeholder={isFetchingFocals ? 'Loading focals…' : 'Select a focal'}
                      disabled={isFetchingFocals}
                      renderItem={item => (
                        <Item size="xs" className="p-0">
                          <ItemContent>
                            <ItemTitle className="whitespace-nowrap">{getFullName(item)}</ItemTitle>
                            <ItemDescription>{item.position}</ItemDescription>
                          </ItemContent>
                        </Item>
                      )}
                    />

                    <AddFocalDialog activityForm={form} />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />
        </div>

        <FormButtons form={form} onSubmit={onSubmit} isPending={!!isMutating} />
      </FieldGroup>
    </form>
  );
}
