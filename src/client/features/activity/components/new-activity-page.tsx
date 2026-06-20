import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { paths } from '@client/app/routes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';
import { setFormErrors } from '@client/lib/utils';
import type { ActivityFormValues } from '@shared/schemas/activity';
import { useActivityForm, useCreateActivity } from '../hooks';
import ActivityForm from './activity-form';

export default function NewActivityPage() {
  const form = useActivityForm();
  const { mutate: createActivity } = useCreateActivity();
  const navigate = useNavigate();

  const onSubmit = (values: ActivityFormValues) =>
    createActivity(values, {
      onSuccess: () => {
        toast.success('Activity created successfully.');
        form.reset();
        navigate(paths.activities);
      },
      onError: error => setFormErrors(form, error),
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">New Activity</CardTitle>
        <CardDescription>Fill up the form below to create a new activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityForm form={form} onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
}
