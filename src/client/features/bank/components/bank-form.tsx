import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import FormButtons from '@client/components/form-buttons';
import { Field, FieldError, FieldGroup, FieldLabel } from '@client/components/ui/field';
import { Input } from '@client/components/ui/input';
import { setFormErrors } from '@client/lib/utils';
import type { AccountFormValues } from '@shared/schemas/account';
import { BankFormSchema, type BankFormValues } from '@shared/schemas/bank';
import { useCreateBank } from '../hooks';

type BankFormProps = {
  accountForm: UseFormReturn<AccountFormValues>;
  onClose: () => void;
};

export default function BankForm({ accountForm, onClose }: BankFormProps) {
  const form = useForm<BankFormValues>({
    resolver: zodResolver(BankFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const { isPending, mutate: createBank } = useCreateBank();

  const handleSubmit = (values: BankFormValues) => {
    createBank(values, {
      onSuccess: id => {
        if (!id) return;
        toast.success('Bank created successfully.');
        form.reset();
        accountForm.setValue('bankId', id);
        accountForm.trigger('bankId');
        onClose();
      },
      onError: error => setFormErrors(form, error),
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
                Name
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Banco Domingo"
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
