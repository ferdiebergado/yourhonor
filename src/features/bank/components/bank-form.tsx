import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import AddButton from '@/components/add-button';
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
import type { AccountFormValues } from '@shared/schemas/account';
import { BankFormSchema, type BankFormValues } from '@shared/schemas/bank';
import type { Dispatch, SetStateAction } from 'react';
import { useCreateBank } from '../hooks';

type BankFormProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  accountForm: UseFormReturn<AccountFormValues>;
};

export default function BankForm({ isOpen, onOpenChange, accountForm }: BankFormProps) {
  const { isPending, mutate: createBank } = useCreateBank();

  const form = useForm<BankFormValues>({
    resolver: zodResolver(BankFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = (values: BankFormValues) => {
    createBank(values, {
      onSuccess: id => {
        if (!id) return;
        toast.success('Bank created successfully.');
        form.reset();
        accountForm.setValue('bankId', id);
        onOpenChange(false);
      },
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger render={<AddButton title="Add Bank" />} />
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle className="font-heading text-xl font-semibold">Add Bank</PopoverTitle>
          <PopoverDescription>Add a new Bank.</PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name} className="w-1/2">
                  Bank
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
        </FieldGroup>

        <SubmitButton form={form} isPending={isPending} onSubmit={handleSubmit} />
      </PopoverContent>
    </Popover>
  );
}
