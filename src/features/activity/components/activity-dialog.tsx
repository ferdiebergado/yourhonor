import { RiAddLargeLine } from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { fetchFocalsOptions } from '@/features/focal/hooks';
import { fetchPositionsOptions } from '@/features/position/hooks';
import { fetchVenuesOptions } from '@/features/venue/hooks';
import { useActivityForm } from '../hooks';
import ActivityForm from './activity-form';

export default function ActivityDialog() {
  const form = useActivityForm();
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery(fetchVenuesOptions());
    queryClient.prefetchQuery(fetchFocalsOptions());
    queryClient.prefetchQuery(fetchPositionsOptions());
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="lg" onMouseEnter={prefetch} onFocus={prefetch}>
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
