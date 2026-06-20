import { useParams } from 'react-router';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';
import { setFormErrors } from '@client/lib/utils';
import type { ActivityFormValues } from '@shared/schemas/activity';
import { useActivity, useActivityForm, useUpdateActivity } from '../hooks';
import ActivityForm from './activity-form';

export default function EditActivityPage() {
  const { code } = useParams<{ code?: string }>();
  const { data: activity } = useActivity(code as string);
  const values: ActivityFormValues = {
    code: activity!.code,
    title: activity!.title,
    startDate: activity!.startDate,
    endDate: activity!.endDate,
    venueId: activity!.venueId,
    focalId: activity!.focalId,
  };
  const form = useActivityForm(values);
  const { mutate: updateActivity } = useUpdateActivity(code as string);

  const onSubmit = (values: ActivityFormValues) =>
    updateActivity(values, {
      onSuccess: () => toast.success('Activity updated successfully.'),
      onError: error => setFormErrors(form, error),
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Edit Activity</CardTitle>
        <CardDescription>Update the details of the activity and save your changes.</CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityForm form={form} onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
}
