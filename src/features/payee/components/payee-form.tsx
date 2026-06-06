import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import FormButtons from '@/components/form-buttons';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import { PayeeFormSchema, type PayeeFormValues } from '@shared/schemas/payee';
import { useCreatePayee } from '../hooks';

type PayeeFormProps = {
  honorariumForm: UseFormReturn<HonorariumFormValues>;
  onClose?: () => void;
};

export default function PayeeForm({ honorariumForm, onClose }: PayeeFormProps) {
  const { isPending, mutate: createPayee } = useCreatePayee();

  const form = useForm<PayeeFormValues>({
    resolver: zodResolver(PayeeFormSchema),
    defaultValues: {
      firstname: '',
      mi: '',
      lastname: '',
      tin: '',
    },
  });

  const handleSubmit = (values: PayeeFormValues) => {
    createPayee(values, {
      onSuccess: id => {
        if (!id) return;
        toast.success('Payee created successfully.');
        form.reset();
        honorariumForm.setValue('payeeId', id);
        honorariumForm.trigger('payeeId');
        onClose?.();
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
              <FieldLabel htmlFor={field.name} className="w-1/2">
                First Name
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Marilyn"
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
            <Field>
              <FieldLabel htmlFor={field.name} className="w-1/2">
                Middle Initial
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="B"
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
                placeholder="Simara"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* TIN */}
        <Controller
          name="tin"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name} className="w-1/2">
                Tax Identification Number (TIN)
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="123456789"
                autoComplete="off"
                value={field.value ?? ''}
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
