import { useParams } from 'react-router';
import { toast } from 'sonner';

import SkeletonCard from '@/components/skeleton-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ActivityFormValues } from '@shared/schemas/activity';
import { useActivity } from '../hooks';
import ActivityForm from './activity-form';

export default function ActivityFormPage() {
  const { code } = useParams();

  const { isPending, isError, error, data, isFetching } = useActivity(code);

  const isEditMode = !!code;

  let initialValues: ActivityFormValues = {
    code: '',
    title: '',
    startDate: '',
    endDate: '',
    venueId: 0,
    focalId: 0,
  };

  if (isEditMode && data) {
    initialValues = {
      code: data.code,
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      venueId: data.venueId,
      focalId: data.focalId,
    };
  }

  if (isPending && isFetching) return <SkeletonCard />;

  if (isError) {
    toast.error(
      error instanceof Error ? error.message : 'An error occurred while fetching activity data.'
    );
    // eslint-disable-next-line unicorn/no-null
    return null;
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
        <ActivityForm key={code ?? 'new'} defaultValues={initialValues} isEditMode={isEditMode} />
      </CardContent>
    </Card>
  );
}
