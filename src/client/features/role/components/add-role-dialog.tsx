import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import AddButton from '@client/components/add-button';
import AppDialog from '@client/components/app-dialog';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import RoleForm from './role-form';

type AddRoleDialogProps = {
  honorariumForm: UseFormReturn<HonorariumFormValues>;
};

export default function AddRoleDialog({ honorariumForm }: AddRoleDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const title = 'Add Role';
  const description = 'Please fill in the details for the new role.';

  return (
    <AppDialog
      title={title}
      description={description}
      trigger={<AddButton aria-label={title} />}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <RoleForm honorariumForm={honorariumForm} onClose={() => setIsOpen(false)} />
    </AppDialog>
  );
}
