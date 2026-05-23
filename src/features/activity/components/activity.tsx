import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query';

import HonorariaCard from '@/features/honorarium/components/honoraria-card';
import { fetchActiveHonorariaOptions } from '@/features/honorarium/hooks';
import { fetchActivityOptions, useActivityCode } from '../hooks';
import ActivityCard from './activity-card';

export default function Activity() {
  const queryClient = useQueryClient();
  const activityCode = useActivityCode();

  const [activityQuery, honorariaQuery] = useSuspenseQueries({
    queries: [
      fetchActivityOptions(queryClient, activityCode),
      fetchActiveHonorariaOptions(activityCode),
    ],
  });

  const { data: activity } = activityQuery;
  const { data: honoraria } = honorariaQuery;

  // eslint-disable-next-line unicorn/no-null
  if (!activity || !honoraria) return null;

  return (
    <div className="space-y-7">
      <ActivityCard activity={activity} />
      <HonorariaCard activityCode={activityCode} honoraria={honoraria} />
    </div>
  );
}
