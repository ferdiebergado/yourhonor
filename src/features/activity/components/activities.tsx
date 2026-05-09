import { Suspense } from 'react';

import PageHeader from '@/components/page-header';
import SkeletonDatatable from '@/components/skeleton-datatable';
import { Card, CardContent } from '@/components/ui/card';
import ActivityDialog from './activity-dialog';
import ActivityTable from './activity-table';

export default function Activities() {
  return (
    <>
      <PageHeader title="My Activities" description="Create, view and update your activities">
        <ActivityDialog />
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
