import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import FormButtons from '@/components/form-buttons';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AddPositionDialog from '@/features/position/components/add-position-dialog';
import PositionInput from '@/features/position/components/position-input';
import { usePositions } from '@/features/position/hooks';
import type { ActivityFormValues } from '@shared/schemas/activity';
import { FocalFormSchema, type FocalFormValues } from '@shared/schemas/focal';
import { useCreateFocal } from '../hooks';

type FocalFormProps = {
  activityForm: UseFormReturn<ActivityFormValues>;
  onClose: () => void;
};

export default function FocalForm({ activityForm, onClose }: FocalFormProps) {
  const { isLoading: isLoadingPositions, data: positions } = usePositions();
  const { isPending, mutate: createFocal } = useCreateFocal();

  const form = useForm<FocalFormValues>({
    resolver: zodResolver(FocalFormSchema),
    defaultValues: {
      firstname: '',
      mi: '',
      lastname: '',
      positionId: 0,
    },
  });

  const handleSubmit = (values: FocalFormValues) => {
    createFocal(values, {
      onSuccess: id => {
        if (!id) return;
        toast.success('Focal person created successfully.');
        form.reset();
        activityForm.setValue('focalId', id);
        activityForm.trigger('focalId');
        onClose();
      },
    });
  };

  return (
    <form>
      <FieldGroup className="gap-4">
        {/* First Name */}
        <Controller
          name="firstname"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Bryan"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Middle Initial */}
        <Controller
          name="mi"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="w-1/4">
              <FieldLabel htmlFor={field.name}>Middle Initial</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="R"
                autoComplete="off"
                value={field.value ?? ''}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Last Name */}
        <Controller
          name="lastname"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name} className="w-1/2">
                Last Name
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Ureta"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Position */}
        <Controller
          name="positionId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Position</FieldLabel>
              <div className="flex gap-2">
                <PositionInput
                  field={field}
                  fieldState={fieldState}
                  isLoading={isLoadingPositions}
                  positions={positions ?? []}
                />
                <AddPositionDialog focalForm={form} />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <FormButtons form={form} onSubmit={handleSubmit} onClose={onClose} isPending={isPending} />
      </FieldGroup>
    </form>
  );
}
