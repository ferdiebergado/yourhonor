import { RiAddLargeLine } from '@remixicon/react';
import { Suspense } from 'react';
import { toast } from 'sonner';

import PageHeader from '@/components/page-header';
import SkeletonDatatable from '@/components/skeleton-datatable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ActivityFormValues } from '@shared/schemas/activity';
import { useActivityForm, useCreateActivity } from '../hooks';
import ActivityDialog from './activity-dialog';
import ActivityTable from './activity-table';

export default function Activities() {
  const form = useActivityForm({
    title: '',
    code: '',
    venueId: 0,
    focalId: 0,
    startDate: '',
    endDate: '',
  });

  const { isPending, mutate: createActivity } = useCreateActivity();

  const onSubmit = (values: ActivityFormValues) => {
    createActivity(values, {
      onSuccess: () => {
        toast.success('Activity created successfully.');
        form.reset();
      },
      onError: () => {
        toast.error('Unable to create activity. Please try again.');
      },
    });
  };

  return (
    <>
      <PageHeader title="My Activities" description="Create, view and update your activities">
        <ActivityDialog
          title="New Activity"
          description="Create a new activity by filling up the form below."
          form={form}
          trigger={
            <Button size="lg">
              <RiAddLargeLine data-icon="inline-start" />
              New Activity
            </Button>
          }
          onSubmit={onSubmit}
          isPending={isPending}
        />
      </PageHeader>

      <Card className="w-full">
        <CardContent>
          <Suspense fallback={<SkeletonDatatable />}>
            <ActivityTable />
          </Suspense>
        </CardContent>
      </Card>
    </>
  );
}
