import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import FormButtons from '@client/components/form-buttons';
import RHFSelect from '@client/components/rhf-select';
import { Field, FieldError, FieldGroup, FieldLabel } from '@client/components/ui/field';
import { Input } from '@client/components/ui/input';
import AddBankDialog from '@client/features/bank/components/add-bank-dialog';
import { useActiveBanks } from '@client/features/bank/hooks';
import { setFormErrors } from '@client/lib/utils';
import { AccountFormSchema, type AccountFormValues } from '@shared/schemas/account';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import { useCreateAccount } from '../hooks';

type AccountFormProps = {
  payeeId: AccountFormValues['payeeId'];
  honorariumForm: UseFormReturn<HonorariumFormValues>;
  onClose: () => void;
};

export default function AccountForm({ payeeId, honorariumForm, onClose }: AccountFormProps) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues: {
      payeeId,
      bankId: 0,
      bankBranch: '',
      accountName: '',
      accountNo: '',
    },
  });

  const { isLoading: isLoadingBanks, data: banks } = useActiveBanks();
  const { isPending, mutate: createAccount } = useCreateAccount();

  const bankItems = banks?.map(({ id, name }) => ({ label: name, value: id.toString() })) ?? [];

  const handleSubmit = (values: AccountFormValues) => {
    createAccount(values, {
      onSuccess: id => {
        if (!id) return;
        toast.success('Account created successfully.');
        form.reset();
        honorariumForm.setValue('accountId', id);
        honorariumForm.trigger('accountId');
        onClose();
      },
      onError: error => setFormErrors(form, error),
    });
  };

  useEffect(() => {
    form.setValue('payeeId', payeeId);
    form.trigger('payeeId');
  }, [payeeId, form]);

  return (
    <form>
      <FieldGroup className="gap-4">
        {/* Bank */}
        <Controller
          name="bankId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Bank</FieldLabel>
              <div className="flex gap-2">
                <RHFSelect
                  id={field.name}
                  field={field}
                  fieldState={fieldState}
                  items={bankItems}
                  isLoading={isLoadingBanks}
                  placeholder="Select a bank..."
                />
                <AddBankDialog accountForm={form} />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Bank Branch */}
        <Controller
          name="bankBranch"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name} className="w-1/2">
                Bank Branch
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Waltermart Carmona"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Account Name */}
        <Controller
          name="accountName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name} className="w-1/2">
                Account Name
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Marilyn B. Ureta"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Account Number */}
        <Controller
          name="accountNo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name} className="w-1/2">
                Account Number
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="SA 123456789"
                autoComplete="off"
                value={field.value}
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
