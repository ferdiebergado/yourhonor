import { zodResolver } from '@hookform/resolvers/zod';
import type { Dispatch, SetStateAction } from 'react';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import { PayeeFormSchema, type PayeeFormValues } from '@shared/schemas/payee';
import { useCreatePayee } from '../hooks';

type PayeeFormProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  honorariumForm: UseFormReturn<HonorariumFormValues>;
};

export default function PayeeForm({ isOpen, onOpenChange, honorariumForm }: PayeeFormProps) {
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
        if (id) honorariumForm.setValue('payeeId', id);
        onOpenChange(false);
      },
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger render={<PopoverTrigger render={<AddButton />} />} />
        <TooltipContent>Add payee</TooltipContent>
      </Tooltip>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle className="font-heading text-xl font-semibold">Add payee</PopoverTitle>
          <PopoverDescription>Add a new payee.</PopoverDescription>
        </PopoverHeader>

        <form>
          <FieldGroup className="gap-4">
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
            <SubmitButton form={form} onSubmit={handleSubmit} isPending={isPending} />
          </FieldGroup>
        </form>
      </PopoverContent>
    </Popover>
  );
}
