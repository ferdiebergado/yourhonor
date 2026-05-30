import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';

import RHFSelect from '@/components/rhf-select';
import SubmitButton from '@/components/submit-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import BankForm from '@/features/bank/components/bank-form';
import { useActiveBanks } from '@/features/bank/hooks';
import { useHonorariumFormContext } from '@/features/honorarium/hooks';
import { type AccountFormValues } from '@shared/schemas/account';
import { useAccountForm, useCreateAccount } from '../hooks';

export default function AccountForm() {
  const [isBankFormOpen, setIsBankFormOpen] = useState(false);

  const { payeeId, form: honorariumForm, setIsAccountFormOpen } = useHonorariumFormContext();
  const { isLoading: isLoadingBanks, data: banks } = useActiveBanks();
  const { isPending, mutate: createAccount } = useCreateAccount();
  const form = useAccountForm(payeeId);

  const bankItems = banks?.map(({ id, name }) => ({ label: name, value: id.toString() })) ?? [];

  const handleSubmit = (values: AccountFormValues) => {
    createAccount(values, {
      onSuccess: id => {
        if (!id) return;
        toast.success('Account created successfully.');
        form.reset();
        honorariumForm.setValue('accountId', id);
        honorariumForm.trigger('accountId');
        setIsAccountFormOpen(false);
      },
    });
  };

  return (
    <form>
      <FieldGroup className="gap-4">
        <Input type="hidden" {...form.register('payeeId')} />

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
                <BankForm
                  isOpen={isBankFormOpen}
                  onOpenChange={setIsBankFormOpen}
                  accountForm={form}
                />
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

        <SubmitButton form={form} onSubmit={handleSubmit} isPending={isPending} />
      </FieldGroup>
    </form>
  );
}
