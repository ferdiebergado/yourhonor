import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import FormButtons from '@/components/form-buttons';
import RHFSelect from '@/components/rhf-select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import GenericCombobox from '@/components/ui/generic-combobox';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import AccountForm from '@/features/account/components/account-form';
import { useActiveAccounts } from '@/features/account/hooks';
import { useActivityCode } from '@/features/activity/hooks';
import PayeeForm from '@/features/payee/components/payee-form';
import { useActivePayees } from '@/features/payee/hooks';
import RoleForm from '@/features/role/components/role-form';
import { useActiveRoles } from '@/features/role/hooks';
import { getFullName } from '@/lib/utils';
import { HonorariumFormSchema, type HonorariumFormValues } from '@shared/schemas/honorarium';
import { computeHonorarium, formatAmount } from '@shared/utils';
import { useEffect } from 'react';
import { useCreateHonorarium } from '../hooks';

export default function HonorariumForm() {
  const { isLoading: isFetchingPayees, data: payees } = useActivePayees();
  const { isLoading: isFetchingRoles, data: roles } = useActiveRoles();
  const { isLoading: isFetchingAccounts, data: accounts } = useActiveAccounts();
  const activityCode = useActivityCode();

  const { isPending, mutate: createHonorarium } = useCreateHonorarium();

  const payeeItems =
    payees?.map(payee => ({ label: getFullName(payee), value: payee.id.toString() })) ?? [];

  const roleItems = roles?.map(({ id, name }) => ({ label: name, value: id.toString() })) ?? [];

  const form = useForm<HonorariumFormValues>({
    resolver: zodResolver(HonorariumFormSchema),
    defaultValues: {
      activityCode,
      payeeId: 0,
      roleId: 0,
      amount: 0,
      accountId: 0,
      taxRate: 10,
      salary: 0,
    },
  });

  const payeeId = useWatch({ control: form.control, name: 'payeeId' });
  const honorarium = useWatch({ control: form.control, name: 'amount' });
  const taxRate = useWatch({ control: form.control, name: 'taxRate' });
  const salary = useWatch({ control: form.control, name: 'salary' });

  const filteredAccounts = accounts?.filter(account => account.payeeId === payeeId) ?? [];
  const { actual, net, hoursRendered } = computeHonorarium(honorarium, salary, taxRate);

  const handleSubmit = (values: HonorariumFormValues) => {
    createHonorarium(values, {
      onSuccess: () => {
        toast.success('Honorarium created successfully.');
        form.reset();
      },
    });
  };

  useEffect(() => {
    form.setValue('activityCode', activityCode);
  }, [activityCode, form]);

  return (
    <Card className="w-full">
      <CardContent>
        <form id="activity-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FieldGroup>
            <Input type="hidden" {...form.register('activityCode')} />

            <Controller
              name="payeeId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Payee</FieldLabel>
                  <div className="flex gap-2">
                    <RHFSelect
                      id={field.name}
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
                      id={field.name}
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

            <Controller
              name="accountId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Bank Account</FieldLabel>
                  <div className="flex gap-2">
                    <GenericCombobox
                      id={field.name}
                      className="flex-1"
                      itemToStringLabel={item => item.accountNumber}
                      itemToStringValue={item => item.id.toString()}
                      // eslint-disable-next-line unicorn/no-null
                      value={accounts?.find(account => account.id === field.value) ?? null}
                      onValueChange={item => field.onChange(item?.id ?? 0)}
                      aria-invalid={fieldState.invalid}
                      placeholder={
                        isFetchingAccounts ? 'Loading bank accounts...' : 'Select a bank account'
                      }
                      items={filteredAccounts}
                      disabled={isFetchingAccounts}
                      renderItem={item => (
                        <Item size="xs" className="p-0" key={item.id}>
                          <ItemContent>
                            <ItemTitle>{item.accountNumber}</ItemTitle>
                            <ItemDescription className="text-balance">
                              {item.bank} <br></br> {item.branch}
                            </ItemDescription>
                          </ItemContent>
                        </Item>
                      )}
                    />
                    <AccountForm payeeId={payeeId} />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="flex gap-2">
              <Controller
                name="salary"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-1/2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Monthly basic salary</FieldLabel>
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
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-1/2" data-invalid={fieldState.invalid}>
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
            </div>

            <Controller
              name="taxRate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-1/2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Tax rate (%)</FieldLabel>
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

            <Separator />
            <div className="flex w-full items-end justify-between gap-2 p-0">
              <Item className="p-0">
                <ItemContent>
                  <ItemTitle className="text-balance">Hours Rendered</ItemTitle>
                  <ItemDescription>{hoursRendered.toFixed(2)}</ItemDescription>
                </ItemContent>
              </Item>
              <Item className="p-0">
                <ItemContent>
                  <ItemTitle className="text-balance">Actual Honorarium</ItemTitle>
                  <ItemDescription>{formatAmount(actual)}</ItemDescription>
                </ItemContent>
              </Item>
              <Item className="p-0">
                <ItemContent>
                  <ItemTitle className="text-balance">Net Honorarium</ItemTitle>
                  <ItemDescription>{formatAmount(net)}</ItemDescription>
                </ItemContent>
              </Item>
            </div>
            <Separator />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <FormButtons form={form} isPending={isPending} onSubmit={handleSubmit} />
      </CardFooter>
    </Card>
  );
}
