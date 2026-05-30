import { Controller } from 'react-hook-form';
import { toast } from 'sonner';

import GenericCombobox from '@/components/generic-combobox';
import RHFSelect from '@/components/rhf-select';
import SubmitButton from '@/components/submit-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import AccountPopover from '@/features/account/components/account-popover';
import { useActiveAccounts } from '@/features/account/hooks';
import PayeePopover from '@/features/payee/components/payee-popover';
import { useActivePayees } from '@/features/payee/hooks';
import RolePopover from '@/features/role/components/role-popover';
import { useActiveRoles } from '@/features/role/hooks';
import { type HonorariumFormValues } from '@shared/schemas/honorarium';
import { computeHonorarium, formatAmount, getFullName } from '@shared/utils';
import { useCreateHonorarium, useHonorariumFormContext } from '../hooks';

export default function HonorariumForm() {
  const { form, payeeId, honorarium, salary, taxRate } = useHonorariumFormContext();

  const { isLoading: isFetchingPayees, data: payees } = useActivePayees();
  const { isLoading: isFetchingRoles, data: roles } = useActiveRoles();
  const { isLoading: isFetchingAccounts, data: accounts } = useActiveAccounts();
  const { isPending, mutate: createHonorarium } = useCreateHonorarium();

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
    <form>
      <FieldGroup>
        <Input type="hidden" {...form.register('activityCode')} />

        {/* Payee */}
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
                <PayeePopover />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Role */}
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
                <RolePopover />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Bank Account */}
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
                  itemToStringLabel={item => item.accountNoMasked}
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
                        <ItemTitle>{item.accountNoMasked}</ItemTitle>
                        <ItemDescription className="text-balance">
                          {item.bank} <br /> {item.bankBranch}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  )}
                />
                <AccountPopover
                  payee={payeeItems.find(payee => payee.value === payeeId.toString())?.label}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex gap-2">
          {/* Basic Monthly Salary */}
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

          {/* Gross Honorarium */}
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

        {/* Tax Rate */}
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
        <SubmitButton form={form} isPending={isPending} onSubmit={handleSubmit} />
      </FieldGroup>
    </form>
  );
}
