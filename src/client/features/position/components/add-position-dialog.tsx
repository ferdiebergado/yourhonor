import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import AddButton from '@client/components/add-button';
import AppDialog from '@client/components/app-dialog';
import type { FocalFormValues } from '@shared/schemas/focal';
import PositionForm from './position-form';

type AddPositionDialogProps = {
  focalForm: UseFormReturn<FocalFormValues>;
};

export default function AddPositionDialog({ focalForm: activityForm }: AddPositionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const title = 'Add Focal Position';
  const description = 'Please fill in the details for the new focal position.';

  return (
    <AppDialog
      title={title}
      description={description}
      trigger={<AddButton aria-label={title} />}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <PositionForm focalForm={activityForm} onClose={() => setIsOpen(false)} />
    </AppDialog>
  );
}
