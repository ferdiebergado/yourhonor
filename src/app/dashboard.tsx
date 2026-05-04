import PageHeader from '@/components/page-header';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" description="Overview of activities" />

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-heading text-2xl font-semibold">Welcome idol!</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card body</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </>
  );
}
