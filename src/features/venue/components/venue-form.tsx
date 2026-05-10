import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import SubmitButton from '@/components/submit-button';
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
import { RiAddLargeLine } from '@remixicon/react';
import type { ActivityFormValues } from '@shared/schemas/activity';
import { VenueFormSchema, type VenueFormValues } from '@shared/schemas/venue';
import { useCreateVenue } from '../hooks';

type VenueFormProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activityForm: UseFormReturn<ActivityFormValues>;
};

export default function VenueForm({ isOpen, onOpenChange, activityForm }: VenueFormProps) {
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
      onSuccess: id => {
        toast.success('Venue created successfully.');
        form.reset();
        if (id) activityForm.setValue('venueId', id);
        onOpenChange(false);
      },
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger />
      <Button type="button" variant="outline" title="Add venue" onClick={() => onOpenChange(true)}>
        <RiAddLargeLine />
      </Button>
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

        <SubmitButton form={form} onSubmit={handleSubmit} isPending={isPending} />
      </PopoverContent>
    </Popover>
  );
}
