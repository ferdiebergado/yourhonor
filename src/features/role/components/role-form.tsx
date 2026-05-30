import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import SubmitButton from '@/components/submit-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useHonorariumFormContext } from '@/features/honorarium/hooks';
import { RoleFormSchema, type RoleFormValues } from '@shared/schemas/role';
import { useCreateRole } from '../hooks';

export default function RoleForm() {
  const { form: honorariumForm, setIsRoleFormOpen } = useHonorariumFormContext();
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
        if (!id) return;
        toast.success('Role created successfully.');
        form.reset();
        honorariumForm.setValue('roleId', id);
        honorariumForm.trigger('roleId');
        setIsRoleFormOpen(false);
      },
    });
  };

  return (
    <form>
      <FieldGroup className="gap-4">
        {/* Role */}
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

        <SubmitButton form={form} isPending={isPending} onSubmit={handleSubmit} />
      </FieldGroup>
    </form>
  );
}
