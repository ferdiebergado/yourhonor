import { RiAddCircleFill } from '@remixicon/react';
import { Suspense } from 'react';

import PageHeader from '@/components/page-header';
import SkeletonDatatable from '@/components/skeleton-datatable';
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
import ActivityForm from './activity-form';
import ActivityTable from './activity-table';

export default function Activities() {
  return (
    <>
      <PageHeader title="My Activities" description="View, create and update your activities">
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
