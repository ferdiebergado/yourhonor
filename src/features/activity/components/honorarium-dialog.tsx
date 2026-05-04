import { RiAddCircleFill } from '@remixicon/react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import HonorariumForm from '@/features/honorarium/components/honorarium-form';

export default function HonorariumDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="lg">
            <RiAddCircleFill data-icon="inline-start" /> Add Honorarium
          </Button>
        }
      />
      <DialogContent className="bg-secondary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">New Honorarium</DialogTitle>
          <DialogDescription>Add a new honorarium by filling out the form below.</DialogDescription>
        </DialogHeader>
        <HonorariumForm />
      </DialogContent>
    </Dialog>
  );
}
