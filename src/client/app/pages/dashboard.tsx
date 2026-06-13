import StatCard from '@client/components/stat-card';
import { Card, CardDescription, CardHeader, CardTitle } from '@client/components/ui/card';
import { useSummary } from '../hooks';

export default function Dashboard() {
  const { data: summary } = useSummary();

  // eslint-disable-next-line unicorn/no-null
  if (!summary) return null;

  return (
    <div className="space-y-7">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-heading text-2xl font-semibold">Dashboard</CardTitle>
          <CardDescription className="text-balance">
            Welcome to your dashboard! Here you can see an overview of your activities and
            honoraria.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex gap-10">
        <StatCard label="Total Activities" value={summary.totalActivities} />
        <StatCard label="Total Honoraria" value={summary.totalHonoraria} />
      </div>
    </div>
  );
}
