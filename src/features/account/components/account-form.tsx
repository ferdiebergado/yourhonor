import { useState, type Dispatch, type SetStateAction } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import AddButton from '@/components/add-button';
import RHFSelect from '@/components/rhf-select';
import SubmitButton from '@/components/submit-button';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import BankForm from '@/features/bank/components/bank-form';
import { useActiveBanks } from '@/features/bank/hooks';
import { type AccountFormValues } from '@shared/schemas/account';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import { useAccountForm, useCreateAccount } from '../hooks';

type AccountFormProps = {
  payeeId: number;
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  honorariumForm: UseFormReturn<HonorariumFormValues>;
};

export default function AccountForm({
  payeeId,
  isOpen,
  onOpenChange,
  honorariumForm,
}: AccountFormProps) {
  const [isBankFormOpen, setIsBankFormOpen] = useState(false);

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
        onOpenChange(false);
      },
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={<PopoverTrigger render={<AddButton disabled={payeeId === 0} />} />}
        />
        <TooltipContent>Add payee bank account</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-90">
        <PopoverHeader>
          <PopoverTitle className="font-heading text-xl font-semibold">
            Add payee bank account
          </PopoverTitle>
          <PopoverDescription>Add a new payee bank account.</PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-4">
          <Input type="hidden" {...form.register('payeeId')} />

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

          <Controller
            name="branch"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name} className="w-1/2">
                  Branch
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

          <Controller
            name="accountNumber"
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
      </PopoverContent>
    </Popover>
  );
}
