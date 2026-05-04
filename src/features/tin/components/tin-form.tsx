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
import { TinFormSchema, type TinFormValues } from '@shared/schemas/tin';
import { useCreateTIN } from '../hooks';

export default function TinForm() {
  const { isPending, mutate: createTIN } = useCreateTIN();

  const form = useForm<TinFormValues>({
    resolver: zodResolver(TinFormSchema),
    defaultValues: {
      payeeId: 0,
      tin: '',
    },
  });

  const handleSubmit = (values: TinFormValues) => {
    createTIN(values, {
      onSuccess: () => {
        toast.success('TIN created successfully.');
        form.reset();
      },
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" title="Add TIN">
            <RiAddLargeLine />
          </Button>
        }
      />
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle className="font-heading text-xl font-semibold">Add TIN</PopoverTitle>
          <PopoverDescription>Add a new TIN.</PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-4">
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
