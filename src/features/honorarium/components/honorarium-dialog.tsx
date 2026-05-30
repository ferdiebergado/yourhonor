import { RiAddLargeLine } from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { fetchActiveAccountsOptions } from '@/features/account/hooks';
import { useActivityCode } from '@/features/activity/hooks';
import HonorariumForm from '@/features/honorarium/components/honorarium-form';
import { fetchActivePayeesOptions } from '@/features/payee/hooks';
import { fetchActiveRolesOptions } from '@/features/role/hooks';
import HonorariumFormProvider from './honorarium-form-provider';

export default function HonorariumDialog() {
  const activityCode = useActivityCode();
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery(fetchActivePayeesOptions());
    queryClient.prefetchQuery(fetchActiveRolesOptions());
    queryClient.prefetchQuery(fetchActiveAccountsOptions());
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="lg" onMouseEnter={prefetch} onFocus={prefetch}>
            <RiAddLargeLine data-icon="inline-start" /> Add Honorarium
          </Button>
        }
      />
      <DialogContent className="bg-secondary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">New Honorarium</DialogTitle>
          <DialogDescription>Add a new honorarium by filling out the form below.</DialogDescription>
        </DialogHeader>
        <Card className="w-full">
          <CardContent className="space-y-6">
            <HonorariumFormProvider activityCode={activityCode}>
              <HonorariumForm />
            </HonorariumFormProvider>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
