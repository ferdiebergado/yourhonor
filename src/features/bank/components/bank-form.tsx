import { zodResolver } from '@hookform/resolvers/zod';
import { RiAddLargeLine } from '@remixicon/react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormButtons from '@/components/form-buttons';
import { Button } from '@/components/ui/button';
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
import { BankFormSchema, type BankFormValues } from '@shared/schemas/bank';
import { useCreateBank } from '../hooks';

export default function BankForm() {
  const { isPending, mutate: createBank } = useCreateBank();

  const form = useForm<BankFormValues>({
    resolver: zodResolver(BankFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = (values: BankFormValues) => {
    createBank(values, {
      onSuccess: () => {
        toast.success('Bank created successfully.');
        form.reset();
      },
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" title="Add Bank">
            <RiAddLargeLine />
          </Button>
        }
      />
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

        <Field orientation="horizontal" className="flex justify-end gap-2">
          <FormButtons form={form} isPending={isPending} onSubmit={handleSubmit} />
        </Field>
      </PopoverContent>
    </Popover>
  );
}
