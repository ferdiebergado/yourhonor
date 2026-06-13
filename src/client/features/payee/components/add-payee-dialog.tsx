import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import AddButton from '@client/components/add-button';
import AppDialog from '@client/components/app-dialog';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import PayeeForm from './payee-form';

type AddPayeeDialogProps = {
  honorariumForm: UseFormReturn<HonorariumFormValues>;
};

export default function AddPayeeDialog({ honorariumForm }: AddPayeeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const title = 'Add Payee';
  const description = 'Please fill in the details for the new payee.';

  return (
    <AppDialog
      title={title}
      description={description}
      trigger={<AddButton aria-label={title} />}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <PayeeForm honorariumForm={honorariumForm} onClose={() => setIsOpen(false)} />
    </AppDialog>
  );
}
