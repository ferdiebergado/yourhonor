import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import AddButton from '@client/components/add-button';
import AppDialog from '@client/components/app-dialog';
import type { AccountFormValues } from '@shared/schemas/account';
import BankForm from './bank-form';

type AddBankDialogProps = {
  accountForm: UseFormReturn<AccountFormValues>;
};

export default function AddBankDialog({ accountForm }: AddBankDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const title = 'Add Bank';
  const description = 'Please fill in the details for the new bank.';

  return (
    <AppDialog
      title={title}
      description={description}
      trigger={<AddButton aria-label={title} />}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <BankForm accountForm={accountForm} onClose={() => setIsOpen(false)} />
    </AppDialog>
  );
}
