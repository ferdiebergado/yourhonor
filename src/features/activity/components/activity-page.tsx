import HonorariaCard from '@/features/honorarium/components/honoraria-card';
import ActivityCard from './activity-card';
import ActivityProvider from './activity-provider';

export default function ActivityPage() {
  return (
    <ActivityProvider>
      <div className="space-y-7">
        <ActivityCard />
        <HonorariaCard />
      </div>
    </ActivityProvider>
  );
}
