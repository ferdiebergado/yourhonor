import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import AddButton from '@client/components/add-button';
import AppDialog from '@client/components/app-dialog';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@client/components/ui/item';
import type { AccountFormValues } from '@shared/schemas/account';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import AccountForm from './account-form';

type AddAccountDialogProps = {
  payeeId: AccountFormValues['payeeId'];
  payee: string;
  honorariumForm: UseFormReturn<HonorariumFormValues>;
};

export default function AddAccountDialog({
  payeeId,
  payee,
  honorariumForm,
}: AddAccountDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const title = 'Add Payee Bank Account';
  const description = 'Please fill in the details for the new bank account.';
  const isDisabled = payeeId === 0;

  return (
    <AppDialog
      title={title}
      description={description}
      trigger={<AddButton aria-label={title} disabled={isDisabled} />}
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={isDisabled}
    >
      <Item className="p-0">
        <ItemHeader>Payee</ItemHeader>
        <ItemContent>
          <ItemTitle>{payee}</ItemTitle>
        </ItemContent>
      </Item>
      <AccountForm
        payeeId={payeeId}
        honorariumForm={honorariumForm}
        onClose={() => setIsOpen(false)}
      />
    </AppDialog>
  );
}
