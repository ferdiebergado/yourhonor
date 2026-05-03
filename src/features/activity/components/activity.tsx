import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateRange } from '@/lib/utils';
import { useActivity } from '../hooks';

type ActivityProps = {
  id: number;
};

export default function Activity({ id }: ActivityProps) {
  const { data: activity } = useActivity(id);

  if (!activity) return <div>Activity not found</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{activity.title}</CardTitle>
        <div className="text-muted-foreground text-sm">Activity ID: {activity.id}</div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium">Code</h3>
            <p className="text-muted-foreground">{activity.code}</p>
          </div>

          <div>
            <h3 className="font-medium">Date Range</h3>
            <p className="text-muted-foreground">
              {formatDateRange(activity.startDate, activity.endDate)}
            </p>
          </div>

          <div>
            <h3 className="font-medium">Venue</h3>
            <p className="text-muted-foreground">{activity.venue}</p>
          </div>

          <div>
            <h3 className="font-medium">Location</h3>
            <p className="text-muted-foreground">{activity.location}</p>
          </div>

          <div>
            <h3 className="font-medium">Focal Person</h3>
            <p className="text-muted-foreground">{activity.focal}</p>
          </div>

          <div>
            <h3 className="font-medium">Position</h3>
            <p className="text-muted-foreground">{activity.focalPosition}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
