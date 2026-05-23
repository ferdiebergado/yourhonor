import { useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import GenericCombobox from '@/components/generic-combobox';
import SubmitButton from '@/components/submit-button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Textarea } from '@/components/ui/textarea';
import FocalForm from '@/features/focal/components/focal-form';
import { useFocals } from '@/features/focal/hooks';
import VenueForm from '@/features/venue/components/venue-form';
import { useVenues } from '@/features/venue/hooks';
import { type ActivityFormValues } from '@shared/schemas/activity';
import { getFullName } from '@shared/utils';

type ActivityFormProps = {
  form: UseFormReturn<ActivityFormValues>;
  onSubmit(data: ActivityFormValues): void;
  isPending: boolean;
};

export default function ActivityForm({ form, onSubmit, isPending }: ActivityFormProps) {
  const [isVenueFormOpen, setIsVenueFormOpen] = useState(false);
  const [isFocalFormOpen, setIsFocalFormOpen] = useState(false);

  const { isLoading: isFetchingVenues, data: venues } = useVenues();
  const { isLoading: isFetchingFocals, data: focals } = useFocals();

  return (
    <Card className="w-full max-w-2xl md:mx-auto">
      <CardContent>
        <form className="space-y-6">
          <FieldGroup>
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
                    className="min-h-30"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

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

                      <VenueForm
                        isOpen={isVenueFormOpen}
                        onOpenChange={setIsVenueFormOpen}
                        activityForm={form}
                      />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <Controller
                name="startDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="endDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>End Date</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

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
                              <ItemTitle className="whitespace-nowrap">
                                {getFullName(item)}
                              </ItemTitle>
                              <ItemDescription>{item.position}</ItemDescription>
                            </ItemContent>
                          </Item>
                        )}
                      />
                      <FocalForm
                        isOpen={isFocalFormOpen}
                        onOpenChange={setIsFocalFormOpen}
                        activityForm={form}
                      />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <SubmitButton form={form} onSubmit={onSubmit} isPending={isPending} />
      </CardFooter>
    </Card>
  );
}
