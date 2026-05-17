import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type Dispatch, type SetStateAction } from 'react';
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
import PositionForm from '@/features/position/components/position-form';
import PositionInput from '@/features/position/components/position-input';
import { usePositions } from '@/features/position/hooks';
import type { ActivityFormValues } from '@shared/schemas/activity';
import { FocalFormSchema, type FocalFormValues } from '@shared/schemas/focal';
import { useCreateFocal } from '../hooks';

type FocalFormProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  activityForm: UseFormReturn<ActivityFormValues>;
};

export default function FocalForm({ isOpen, onOpenChange, activityForm }: FocalFormProps) {
  const [isPositionFormOpen, setIsPositionFormOpen] = useState(false);

  const { isLoading: isLoadingPositions, data: positions } = usePositions();
  const { isPending, mutate: createFocal } = useCreateFocal();

  const form = useForm<FocalFormValues>({
    resolver: zodResolver(FocalFormSchema),
    defaultValues: {
      firstname: '',
      mi: '',
      lastname: '',
      positionId: 0,
    },
  });

  const handleSubmit = (values: FocalFormValues) => {
    createFocal(values, {
      onSuccess: id => {
        if (!id) return;
        toast.success('Focal person created successfully.');
        form.reset();
        activityForm.setValue('focalId', id);
        onOpenChange(false);
      },
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger render={<PopoverTrigger render={<AddButton />} />} />
        <TooltipContent>Add focal person</TooltipContent>
      </Tooltip>

      <PopoverContent align="start" className="md:w-96">
        <PopoverHeader>
          <PopoverTitle className="font-heading text-xl font-semibold">
            Add focal person
          </PopoverTitle>
          <PopoverDescription>Add a new focal person.</PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-4">
          <Controller
            name="firstname"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Bryan"
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
              <Field className="w-1/4">
                <FieldLabel htmlFor={field.name}>Middle Initial</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="R"
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
                  placeholder="Ureta"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="positionId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Position</FieldLabel>
                <div className="flex gap-2">
                  <PositionInput
                    field={field}
                    fieldState={fieldState}
                    isLoading={isLoadingPositions}
                    positions={positions ?? []}
                  />
                  <PositionForm
                    isOpen={isPositionFormOpen}
                    onOpenChange={setIsPositionFormOpen}
                    focalForm={form}
                  />
                </div>
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
