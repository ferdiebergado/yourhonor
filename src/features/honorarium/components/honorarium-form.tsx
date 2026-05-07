import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormButtons from '@/components/form-buttons';
import RHFSelect from '@/components/rhf-select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AccountForm from '@/features/account/components/account-form';
import AccountInput from '@/features/account/components/account-input';
import { useActiveAccounts } from '@/features/account/hooks';
import PayeeForm from '@/features/payee/components/payee-form';
import { useActivePayees } from '@/features/payee/hooks';
import RoleForm from '@/features/role/components/role-form';
import { useActiveRoles } from '@/features/role/hooks';
import { getFullName } from '@/lib/utils';
import { HonorariumFormSchema, type HonorariumFormValues } from '@shared/schemas/honorarium';
import { useCreateHonorarium } from '../hooks';

export default function HonorariumForm() {
  const { isLoading: isFetchingPayees, data: payees } = useActivePayees();
  const { isLoading: isFetchingRoles, data: roles } = useActiveRoles();
  const { isLoading: isFetchingAccounts, data: accounts } = useActiveAccounts();

  const { isPending, mutate: createHonorarium } = useCreateHonorarium();

  const payeeItems =
    payees?.map(payee => ({ label: getFullName(payee), value: payee.id.toString() })) ?? [];

  const roleItems = roles?.map(({ id, name }) => ({ label: name, value: id.toString() })) ?? [];

  const form = useForm<HonorariumFormValues>({
    resolver: zodResolver(HonorariumFormSchema),
    defaultValues: {
      activityId: 0,
      payeeId: 0,
      roleId: 0,
      amount: 0,
      hoursRendered: 0,
      accountId: 0,
    },
  });

  const handleSubmit = (values: HonorariumFormValues) => {
    createHonorarium(values, {
      onSuccess: () => {
        toast.success('Honorarium created successfully.');
        form.reset();
      },
    });
  };

  return (
    <Card className="w-full">
      <CardContent>
        <form id="activity-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="payeeId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Payee</FieldLabel>
                  <div className="flex gap-2">
                    <RHFSelect
                      field={field}
                      fieldState={fieldState}
                      items={payeeItems}
                      isLoading={isFetchingPayees}
                      placeholder="Select a payee..."
                    />
                    <PayeeForm />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="roleId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                  <div className="flex gap-2">
                    <RHFSelect
                      field={field}
                      fieldState={fieldState}
                      items={roleItems}
                      isLoading={isFetchingRoles}
                      placeholder="Select a role..."
                    />
                    <RoleForm />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="flex gap-2">
              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Gross Honorarium</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      step="any"
                      inputMode="decimal"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="hoursRendered"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Hours rendered</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      step="any"
                      inputMode="decimal"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="accountId"
              control={form.control}
              render={({ field, fieldState }) => {
                const selectedAccount =
                  // eslint-disable-next-line unicorn/no-null
                  accounts?.find(account => account.id === field.value) ?? null;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Bank Account</FieldLabel>
                    <div className="flex gap-2">
                      <AccountInput
                        id={field.name}
                        className="flex-1"
                        value={selectedAccount}
                        onValueChange={account => field.onChange(account?.id ?? 0)}
                        aria-invalid={fieldState.invalid}
                        placeholder={
                          isFetchingAccounts ? 'Loading bank accounts...' : 'Select a bank account'
                        }
                        accounts={accounts ?? []}
                        disabled={isFetchingAccounts}
                      />
                      <AccountForm />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <FormButtons form={form} isPending={isPending} onSubmit={handleSubmit} />
      </CardFooter>
    </Card>
  );
}
