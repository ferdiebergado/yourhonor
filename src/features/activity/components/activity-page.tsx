import { Suspense } from 'react';

import PageHeader from '@/components/page-header';
import HonorariumDialog from '@/features/honorarium/components/honorarium-dialog';
import Activity from './activity';
import ActivityCodeProvider from './activity-provider';
import ActivitySkeletonCard from './activity-skeleton-card';

export default function ActivityPage() {
  return (
    <ActivityCodeProvider>
      <PageHeader title="Activity Details" description="View and update your activity">
        <HonorariumDialog />
      </PageHeader>

      <Suspense fallback={<ActivitySkeletonCard />}>
        <Activity />
      </Suspense>
    </ActivityCodeProvider>
  );
}
