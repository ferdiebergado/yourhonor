import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import AddButton from '@/components/add-button';
import AppDialog from '@/components/app-dialog';
import type { ActivityFormValues } from '@shared/schemas/activity';
import FocalForm from './focal-form';

type FocalDialogProps = {
  activityForm: UseFormReturn<ActivityFormValues>;
};

export default function AddFocalDialog({ activityForm }: FocalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const title = 'Add Focal Person';
  const description = 'Please fill in the details for the new focal person.';

  return (
    <AppDialog
      title={title}
      description={description}
      trigger={<AddButton aria-label={title} />}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <FocalForm activityForm={activityForm} onClose={() => setIsOpen(false)} />
    </AppDialog>
  );
}
