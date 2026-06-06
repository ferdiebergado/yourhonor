import { useParams } from 'react-router';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type HonorariumFormValues } from '@shared/schemas/honorarium';
import HonorariumForm from './honorarium-form';

export default function HonorariumFormPage() {
  const { code } = useParams<{ code: string }>();

  const initialValues: HonorariumFormValues = {
    activityCode: code ?? '',
    payeeId: 0,
    roleId: 0,
    salary: 0,
    amount: 0,
    taxRate: 10,
    accountId: 0,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">New Honorarium</CardTitle>
        <CardDescription className="text-balance">
          Fill out the form below to create a new honorarium.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HonorariumForm key="new" defaultValues={initialValues} />
      </CardContent>
    </Card>
  );
}
