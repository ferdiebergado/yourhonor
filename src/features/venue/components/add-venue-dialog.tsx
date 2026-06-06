import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import AddButton from '@/components/add-button';
import AppDialog from '@/components/app-dialog';
import type { ActivityFormValues } from '@shared/schemas/activity';
import VenueForm from './venue-form';

type VenueDialogProps = {
  activityForm: UseFormReturn<ActivityFormValues>;
};

export default function AddVenueDialog({ activityForm }: VenueDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const title = 'Add Venue';
  const description = 'Please fill in the details for the new venue.';

  return (
    <AppDialog
      title={title}
      description={description}
      trigger={<AddButton aria-label={title} />}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <VenueForm activityForm={activityForm} onClose={() => setIsOpen(false)} />
    </AppDialog>
  );
}
