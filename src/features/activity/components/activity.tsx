import { useActivity, useActivityCode } from '@/features/activity/hooks';
import HonorariaCard from '@/features/honorarium/components/honoraria-card';
import ActivityCard from './activity-card';

export default function Activity() {
  const activityCode = useActivityCode();
  const { data: activity } = useActivity(activityCode);

  // eslint-disable-next-line unicorn/no-null
  if (!activity) return null;

  return (
    <div className="space-y-7">
      <ActivityCard activity={activity} />
      <HonorariaCard activityCode={activityCode} honoraria={activity.honoraria} />
    </div>
  );
}
