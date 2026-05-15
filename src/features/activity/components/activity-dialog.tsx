import { RiAddLargeLine } from '@remixicon/react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useActivityForm } from '../hooks';
import ActivityForm from './activity-form';

export default function ActivityDialog() {
  const form = useActivityForm();

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="lg">
            <RiAddLargeLine data-icon="inline-start" />
            New Activity
          </Button>
        }
      />
      <DialogContent className="bg-secondary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">New Activity</DialogTitle>
          <DialogDescription>
            Create a new activity by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <ActivityForm form={form} />
      </DialogContent>
    </Dialog>
  );
}
