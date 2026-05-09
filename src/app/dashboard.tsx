import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMe } from '@/features/auth/hooks';
import { useSummary } from './hooks';

export default function Dashboard() {
  const { data: me } = useMe();
  const { data: summary } = useSummary();

  // eslint-disable-next-line unicorn/no-null
  if (!me || !summary) return null;

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of activities" />

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-heading text-2xl font-semibold">
            Welcome honorable {me.name}!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center gap-10 p-5">
          <Card className="w-1/4 border p-5 text-center shadow-none">
            <CardDescription>Total Activities</CardDescription>
            <CardHeader className="font-heading text-6xl font-semibold">
              {summary.totalActivities}
            </CardHeader>
          </Card>
          <Card className="w-1/4 border p-5 text-center shadow-none">
            <CardDescription>Total Honoraria</CardDescription>
            <CardHeader className="font-heading text-6xl font-semibold">
              {summary.totalHonoraria}
            </CardHeader>
          </Card>
        </CardContent>
      </Card>
    </>
  );
}
