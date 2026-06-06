import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        <Card className="w-1/2 p-2 md:w-1/4 md:p-5">
          <CardHeader>
            <CardTitle>Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-center text-6xl font-semibold">
              {summary.totalActivities}
            </p>
          </CardContent>
        </Card>
        <Card className="w-1/2 p-2 md:w-1/4 md:p-5">
          <CardHeader>
            <CardTitle>Total Honoraria</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-center text-6xl font-semibold">
              {summary.totalHonoraria}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
