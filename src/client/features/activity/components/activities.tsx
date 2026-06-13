import { RiAddLargeLine } from '@remixicon/react';
import { Suspense } from 'react';
import { useNavigate } from 'react-router';

import { paths } from '@client/app/routes';
import SkeletonDatatable from '@client/components/skeleton-datatable';
import { Button } from '@client/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';
import ActivityTable from './activity-table';

export default function Activities() {
  const navigate = useNavigate();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">My Activities</CardTitle>
        <CardDescription className="text-balance">
          Below is a list of your activities. Click on an activity to view or edit its details.
        </CardDescription>
        <CardAction>
          <Button size="lg" onClick={() => navigate(paths.newActivity)}>
            <RiAddLargeLine data-icon="inline-start" />
            New Activity
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<SkeletonDatatable />}>
          <ActivityTable />
        </Suspense>
      </CardContent>
    </Card>
  );
}
