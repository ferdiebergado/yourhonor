import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import FormButtons from '@client/components/form-buttons';
import { Field, FieldError, FieldGroup, FieldLabel } from '@client/components/ui/field';
import { Input } from '@client/components/ui/input';
import { setFormErrors } from '@client/lib/utils';
import type { ActivityFormValues } from '@shared/schemas/activity';
import { VenueFormSchema, type VenueFormValues } from '@shared/schemas/venue';
import { useCreateVenue } from '../hooks';

type VenueFormProps = {
  activityForm: UseFormReturn<ActivityFormValues>;
  onClose: () => void;
};

export default function VenueForm({ activityForm, onClose }: VenueFormProps) {
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
        if (!id) return;
        toast.success('Venue created successfully.');
        form.reset();
        activityForm.setValue('venueId', id);
        activityForm.trigger('venueId');
        onClose();
      },
      onError: error => setFormErrors(form, error),
    });
  };

  return (
    <form>
      <FieldGroup className="gap-4">
        {/* Name */}
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

        {/* Location */}
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

        <FormButtons form={form} onSubmit={handleSubmit} onClose={onClose} isPending={isPending} />
      </FieldGroup>
    </form>
  );
}
