import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';

import GenericCombobox from '@/components/generic-combobox';
import RHFSelect from '@/components/rhf-select';
import SubmitButton from '@/components/submit-button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import AccountForm from '@/features/account/components/account-form';
import { useActiveAccounts } from '@/features/account/hooks';
import { useActivityCode } from '@/features/activity/hooks';
import PayeeForm from '@/features/payee/components/payee-form';
import { useActivePayees } from '@/features/payee/hooks';
import RoleForm from '@/features/role/components/role-form';
import { useActiveRoles } from '@/features/role/hooks';
import { type HonorariumFormValues } from '@shared/schemas/honorarium';
import { computeHonorarium, formatAmount, getFullName } from '@shared/utils';
import { useCreateHonorarium, useHonorariumForm } from '../hooks';

export default function HonorariumForm() {
  const [isPayeeFormOpen, setIsPayeeFormOpen] = useState(false);
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);

  const activityCode = useActivityCode();
  const { isLoading: isFetchingPayees, data: payees } = useActivePayees();
  const { isLoading: isFetchingRoles, data: roles } = useActiveRoles();
  const { isLoading: isFetchingAccounts, data: accounts } = useActiveAccounts();
  const { isPending, mutate: createHonorarium } = useCreateHonorarium();
  const { form, payeeId, honorarium, salary, taxRate } = useHonorariumForm(activityCode);

  const payeeItems =
    payees?.map(payee => ({ label: getFullName(payee), value: payee.id.toString() })) ?? [];
  const roleItems = roles?.map(({ id, name }) => ({ label: name, value: id.toString() })) ?? [];

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

  return (
    <Card className="w-full">
      <CardContent className="space-y-6">
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
                  <PayeeForm
                    isOpen={isPayeeFormOpen}
                    onOpenChange={setIsPayeeFormOpen}
                    honorariumForm={form}
                  />
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
                  <RoleForm
                    isOpen={isRoleFormOpen}
                    onOpenChange={setIsRoleFormOpen}
                    honorariumForm={form}
                  />
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
                            {item.bank} <br /> {item.branch}
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    )}
                  />
                  <AccountForm
                    payeeId={payeeId}
                    isOpen={isAccountFormOpen}
                    onOpenChange={setIsAccountFormOpen}
                    honorariumForm={form}
                  />
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
                  <FieldLabel htmlFor={field.name}>Basic Monthly Salary</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Tax Rate (%)</FieldLabel>
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

          <div className="flex w-full items-end justify-between gap-2 rounded-md border p-3">
            <Item className="p-0">
              <ItemContent>
                <ItemTitle className="text-balance">Hours Rendered</ItemTitle>
                <ItemDescription>{hoursRendered}</ItemDescription>
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
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <SubmitButton form={form} isPending={isPending} onSubmit={handleSubmit} />
      </CardFooter>
    </Card>
  );
}
