import { Suspense } from 'react';
import { useParams } from 'react-router';

import PageHeader from '@/components/page-header';
import Activity from './activity';
import ActivitySkeletonCard from './activity-skeleton-card';
import HonorariumDialog from './honorarium-dialog';

export default function ActivityPage() {
  const params = useParams();

  return (
    <>
      <PageHeader title="Activity Details" description="View and update your activity">
        <HonorariumDialog />
      </PageHeader>

      <Suspense fallback={<ActivitySkeletonCard />}>
        <Activity id={Number(params.id)} />
      </Suspense>
    </>
  );
}
