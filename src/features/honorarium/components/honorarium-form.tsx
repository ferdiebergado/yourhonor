import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import FormButtons from '@/components/form-buttons';
import GenericCombobox from '@/components/generic-combobox';
import RHFSelect from '@/components/rhf-select';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import AddAccountDialog from '@/features/account/components/add-account-dialog';
import { useActiveAccounts } from '@/features/account/hooks';
import AddPayeeDialog from '@/features/payee/components/add-payee-dialog';
import { useActivePayees } from '@/features/payee/hooks';
import AddRoleDialog from '@/features/role/components/add-role-dialog';
import { useActiveRoles } from '@/features/role/hooks';
import { HonorariumFormSchema, type HonorariumFormValues } from '@shared/schemas/honorarium';
import { computeHonorarium, formatAmount, getFullName } from '@shared/utils';
import { useCreateHonorarium } from '../hooks';

type HonorariumFormProps = {
  defaultValues: HonorariumFormValues;
};

export default function HonorariumForm({ defaultValues }: HonorariumFormProps) {
  const { isLoading: isFetchingPayees, data: payees } = useActivePayees();
  const { isLoading: isFetchingRoles, data: roles } = useActiveRoles();
  const { isLoading: isFetchingAccounts, data: accounts } = useActiveAccounts();
  const { isPending, mutate: createHonorarium } = useCreateHonorarium();
  const navigate = useNavigate();

  const form = useForm<HonorariumFormValues>({
    resolver: zodResolver(HonorariumFormSchema),
    defaultValues,
  });

  const { control } = form;

  const payeeId = useWatch({ control, name: 'payeeId' });
  const honorarium = useWatch({ control, name: 'amount' });
  const taxRate = useWatch({ control, name: 'taxRate' });
  const salary = useWatch({ control, name: 'salary' });

  const payeeItems =
    payees?.map(payee => ({ label: getFullName(payee), value: payee.id.toString() })) ?? [];
  const roleItems = roles?.map(({ id, name }) => ({ label: name, value: id.toString() })) ?? [];

  const filteredAccounts = accounts?.filter(account => account.payeeId === payeeId) ?? [];
  const { actual, net, hoursRendered } = computeHonorarium(honorarium, salary, taxRate);

  function onSubmit(values: HonorariumFormValues) {
    createHonorarium(values, {
      onSuccess: () => {
        toast.success('Honorarium created successfully.');
        form.reset();
        navigate(-1);
      },
    });
  }

  useEffect(() => form.setValue('accountId', 0), [payeeId, form]);

  return (
    <form>
      <FieldGroup>
        <div className="flex gap-8">
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
                  <AddPayeeDialog honorariumForm={form} />
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
                  <AddRoleDialog honorariumForm={form} />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="flex gap-8">
          {/* Bank Account */}
          <Controller
            name="accountId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-1/2" data-invalid={fieldState.invalid}>
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

                  <AddAccountDialog
                    payeeId={payeeId}
                    payee={
                      payeeItems.find(payee => payee.value === payeeId.toString())?.label ?? ''
                    }
                    honorariumForm={form}
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

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
        </div>
        <div className="flex gap-8">
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
        </div>

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

        <FormButtons form={form} onSubmit={onSubmit} isPending={isPending} />
      </FieldGroup>
    </form>
  );
}
