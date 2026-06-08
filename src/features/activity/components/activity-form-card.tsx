import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ActivityFormValues } from '@shared/schemas/activity';
import { useActivityContext } from '../hooks';
import ActivityForm from './activity-form';

export default function ActivityFormCard() {
  const activity = useActivityContext();

  const isEditMode = !!activity;

  let initialValues: ActivityFormValues = {
    code: '',
    title: '',
    startDate: '',
    endDate: '',
    venueId: 0,
    focalId: 0,
  };

  if (isEditMode && activity) {
    initialValues = {
      code: activity.code,
      title: activity.title,
      startDate: activity.startDate,
      endDate: activity.endDate,
      venueId: activity.venueId,
      focalId: activity.focalId,
    };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {isEditMode ? 'Edit Activity' : 'New Activity'}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? 'Update the details of your activity and save your changes.'
            : 'Fill out the form below to create a new activity.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityForm
          key={activity?.code ?? 'new'}
          defaultValues={initialValues}
          isEditMode={isEditMode}
        />
      </CardContent>
    </Card>
  );
}
