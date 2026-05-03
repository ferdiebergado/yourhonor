import { zodResolver } from '@hookform/resolvers/zod';
import { RiAddCircleLine } from '@remixicon/react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { VenueFormSchema, type VenueFormValues } from '@shared/schemas/venue';
import { useCreateVenue } from '../hooks';

export default function VenueForm() {
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(VenueFormSchema),
    defaultValues: {
      name: '',
      location: '',
    },
  });

  const { isPending, mutate: createVenue } = useCreateVenue();

  const handleSubmit = (values: VenueFormValues) => {
    createVenue(values, {
      onSuccess: () => {
        toast.success('Venue created successfully.');
        form.reset();
      },
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" title="Add venue">
            <RiAddCircleLine />
          </Button>
        }
      />
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle className="font-heading text-xl font-semibold">Add Venue</PopoverTitle>
          <PopoverDescription>Add a new venue.</PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name} className="w-1/2">
                  Name
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Hotel Simara"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name} className="w-1/2">
                  Location
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Caloocan City"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <Field orientation="horizontal" className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="button" onClick={form.handleSubmit(handleSubmit)} disabled={isPending}>
            {isPending ? 'Saving...' : 'Submit'}
          </Button>
        </Field>
      </PopoverContent>
    </Popover>
  );
}
