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
import { useCreatePosition } from '@/features/position/hooks';
import type { FocalFormValues } from '@shared/schemas/focal';
import { PositionFormSchema, type PositionFormValues } from '@shared/schemas/position';

type PositionFormProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  focalForm: UseFormReturn<FocalFormValues>;
};

export default function PositionForm({ isOpen, onOpenChange, focalForm }: PositionFormProps) {
  const { isPending, mutate: createPosition } = useCreatePosition();

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(PositionFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = (values: PositionFormValues) => {
    createPosition(values, {
      onSuccess: id => {
        if (!id) return;
        toast.success('Position created successfully.');
        form.reset();
        focalForm.setValue('positionId', id);
        onOpenChange(false);
      },
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger render={<PopoverTrigger render={<AddButton />} />} />
        <TooltipContent>Add position</TooltipContent>
      </Tooltip>
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
