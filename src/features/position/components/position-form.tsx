import { zodResolver } from '@hookform/resolvers/zod';
import { RiAddCircleLine } from '@remixicon/react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import SubmitButton from '@/components/submit-button';
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
import { useCreatePosition } from '@/features/position/hooks';
import { PositionFormSchema, type PositionFormValues } from '@shared/schemas/position';

export default function PositionForm() {
  const { isPending, mutate: createPosition } = useCreatePosition();

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(PositionFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = (values: PositionFormValues) => {
    createPosition(values, {
      onSuccess: () => {
        toast.success('Position created successfully.');
        form.reset();
      },
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" title="Add position">
            <RiAddCircleLine />
          </Button>
        }
      />
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle className="font-heading text-xl font-semibold">Add position</PopoverTitle>
          <PopoverDescription>Add a new position.</PopoverDescription>
        </PopoverHeader>
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
        </FieldGroup>

        <SubmitButton form={form} onSubmit={handleSubmit} isPending={isPending} />
      </PopoverContent>
    </Popover>
  );
}
