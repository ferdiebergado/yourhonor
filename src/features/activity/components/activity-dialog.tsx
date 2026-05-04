import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RiAddCircleFill } from '@remixicon/react';
import ActivityForm from './activity-form';

export default function ActivityDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="lg">
            <RiAddCircleFill data-icon="inline-start" /> New Activity
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
        <ActivityForm />
      </DialogContent>
    </Dialog>
  );
}
