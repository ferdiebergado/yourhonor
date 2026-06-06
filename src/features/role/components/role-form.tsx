import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import FormButtons from '@/components/form-buttons';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { type HonorariumFormValues } from '@shared/schemas/honorarium';
import { RoleFormSchema, type RoleFormValues } from '@shared/schemas/role';
import { useCreateRole } from '../hooks';

type RoleFormProps = {
  honorariumForm: UseFormReturn<HonorariumFormValues>;
  onClose: () => void;
};

export default function RoleForm({ honorariumForm, onClose }: RoleFormProps) {
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
        onClose();
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

        <FormButtons form={form} onSubmit={handleSubmit} onClose={onClose} isPending={isPending} />
      </FieldGroup>
    </form>
  );
}
