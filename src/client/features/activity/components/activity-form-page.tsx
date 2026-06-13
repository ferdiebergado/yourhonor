import ActivityFormCard from './activity-form-card';
import ActivityProvider from './activity-provider';

export default function ActivityFormPage() {
  return (
    <ActivityProvider>
      <ActivityFormCard />
    </ActivityProvider>
  );
}
