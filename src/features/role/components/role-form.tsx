import { zodResolver } from '@hookform/resolvers/zod';
import { RiAddLargeLine } from '@remixicon/react';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
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
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import { RoleFormSchema, type RoleFormValues } from '@shared/schemas/role';
import { useCreateRole } from '../hooks';

type RoleFormProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  honorariumForm: UseFormReturn<HonorariumFormValues>;
};

export default function RoleForm({ isOpen, onOpenChange, honorariumForm }: RoleFormProps) {
  const { isPending, mutate: createRole } = useCreateRole();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = (values: RoleFormValues) => {
    createRole(values, {
      onSuccess: id => {
        toast.success('Role created successfully.');
        form.reset();
        if (id) honorariumForm.setValue('roleId', id);
        onOpenChange(false);
      },
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger />
      <Button variant="outline" title="Add role" onClick={() => onOpenChange(true)}>
        <RiAddLargeLine />
      </Button>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle className="font-heading text-xl font-semibold">Add role</PopoverTitle>
          <PopoverDescription>Add a new role.</PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name} className="w-1/2">
                  Role
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Resource Person"
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
