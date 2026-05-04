import { zodResolver } from '@hookform/resolvers/zod';
import { RiAddCircleLine } from '@remixicon/react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PositionForm from '@/features/position/components/position-form';
import PositionInput from '@/features/position/components/position-input';
import { usePositions } from '@/features/position/hooks';
import { FocalFormSchema, type FocalFormValues } from '@shared/schemas/focal';
import { useCreateFocal } from '../hooks';

export default function FocalForm() {
  const { isLoading: isLoadingPositions, data: positions } = usePositions();
  const { isPending, mutate: createFocal } = useCreateFocal();

  const form = useForm<FocalFormValues>({
    resolver: zodResolver(FocalFormSchema),
    defaultValues: {
      firstname: '',
      mi: '',
      lastname: '',
      sex: 'M',
      positionId: 0,
    },
  });

  const handleSubmit = (values: FocalFormValues) => {
    createFocal(values, {
      onSuccess: () => {
        toast.success('Focal person created successfully.');
        form.reset();
      },
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" title="Add focal person">
            <RiAddCircleLine />
          </Button>
        }
      />
      <PopoverContent align="start">
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
                <FieldLabel htmlFor={field.name} className="w-1/2">
                  First Name
                </FieldLabel>
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
              <Field>
                <FieldLabel htmlFor={field.name} className="w-1/2">
                  Middle Initial
                </FieldLabel>
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
            name="sex"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <Label htmlFor={field.name}>Sex</Label>
                <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="M" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="F" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
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
                  <PositionForm />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <Field orientation="horizontal" className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="button" onClick={form.handleSubmit(handleSubmit)} disabled={isPending}>
            {isPending ? 'Saving...' : 'Submit'}
          </Button>
        </Field>
      </PopoverContent>
    </Popover>
  );
}
