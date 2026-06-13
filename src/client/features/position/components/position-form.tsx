import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import FormButtons from '@client/components/form-buttons';
import { Field, FieldError, FieldGroup, FieldLabel } from '@client/components/ui/field';
import { Input } from '@client/components/ui/input';
import { useCreatePosition } from '@client/features/position/hooks';
import type { FocalFormValues } from '@shared/schemas/focal';
import { PositionFormSchema, type PositionFormValues } from '@shared/schemas/position';

type PositionFormProps = {
  focalForm: UseFormReturn<FocalFormValues>;
  onClose: () => void;
};

export default function PositionForm({ focalForm, onClose }: PositionFormProps) {
  const { isPending, mutate: createPosition } = useCreatePosition();

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(PositionFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = (values: PositionFormValues) => {
    createPosition(values, {
      onSuccess: id => {
        if (!id) return;
        toast.success('Position created successfully.');
        form.reset();
        focalForm.setValue('positionId', id);
        focalForm.trigger('positionId');
        onClose();
      },
    });
  };

  return (
    <form>
      <FieldGroup className="gap-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name} className="w-1/2">
                Position
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Education Program Specialist"
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
