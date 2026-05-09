import { Suspense } from 'react';
import { toast } from 'sonner';

import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import HonorariumTable from '@/features/honorarium/components/honorarium-table';
import SkeletonHonorariumTable from '@/features/honorarium/components/skeleton-honorarium-table';
import {
  useActiveHonoraria,
  useGenCert,
  useGenComp,
  useGenORS,
  useGenPayroll,
} from '@/features/honorarium/hooks';
import type { ActivityFullDetail } from '@shared/schemas/activity';
import { toDateRange } from '@shared/utils';
import { useActivity, useActivityCode } from '../hooks';

type SingleFieldConfig = { key: keyof ActivityFullDetail; label: string };

type MultiFieldConfig = {
  keys: [keyof ActivityFullDetail, keyof ActivityFullDetail];
  label: string;
  format: (val1: string, val2: string) => string;
};

type ActivityFieldConfig = SingleFieldConfig | MultiFieldConfig;

const isMultiFieldConfig = (field: ActivityFieldConfig): field is MultiFieldConfig =>
  'keys' in field && 'format' in field;

type GeneratorButtonProps = {
  title: string;
  isLoading: boolean;
  onClick: () => void;
};

function GeneratorButton({ title, isLoading, onClick }: GeneratorButtonProps) {
  return (
    <Button variant="outline" className="w-35" onClick={onClick} disabled={isLoading}>
      {isLoading ? <Spinner text="Generating..." /> : title}
    </Button>
  );
}

export default function Activity() {
  const activityCode = useActivityCode();
  const { data: activity } = useActivity(activityCode);
  const { data: honoraria } = useActiveHonoraria(activityCode);
  const { isPending: isGeneratingCert, mutate: genCert } = useGenCert();
  const { isPending: isGeneratingComp, mutate: genComp } = useGenComp();
  const { isPending: isGeneratingORS, mutate: genORS } = useGenORS();
  const { isPending: isGeneratingPayroll, mutate: genPayroll } = useGenPayroll();

  // eslint-disable-next-line unicorn/no-null
  if (!activity) return null;

  // Define activity fields for dynamic rendering
  const activityFields: ActivityFieldConfig[] = [
    {
      keys: ['startDate', 'endDate'],
      label: 'Date of Conduct',
      format: (startDate: string, endDate: string) => toDateRange(startDate, endDate),
    },
    {
      keys: ['venue', 'location'],
      label: 'Venue',
      format: (venue: string, location: string) => `${venue}, ${location}`,
    },
    { key: 'focal', label: 'Focal Person' },
    { key: 'focalPosition', label: 'Position' },
    { key: 'code', label: 'Activity Code' },
    { key: 'fundSource', label: 'Fund Source' },
  ];

  const buttonData: GeneratorButtonProps[] = [
    {
      title: 'Certification',
      isLoading: isGeneratingCert,
      onClick: () =>
        genCert(activityCode, {
          onSuccess: () => toast.success('Certification generated.'),
        }),
    },
    {
      title: 'Computation',
      isLoading: isGeneratingComp,
      onClick: () =>
        genComp(activityCode, {
          onSuccess: () => toast.success('Computation generated.'),
        }),
    },
    {
      title: 'ORS/DV',
      isLoading: isGeneratingORS,
      onClick: () => genORS(activityCode, { onSuccess: () => toast.success('ORS/DV generated.') }),
    },
    {
      title: 'Payroll',
      isLoading: isGeneratingPayroll,
      onClick: () =>
        genPayroll(activityCode, { onSuccess: () => toast.success('Payroll generated.') }),
    },
  ];

  return (
    <div className="space-y-7">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{activity.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activityFields.map((field, index) => (
              <Item className="p-0" key={index}>
                <ItemContent>
                  <ItemTitle>{field.label}</ItemTitle>
                  <ItemDescription>
                    {isMultiFieldConfig(field)
                      ? field.format(
                          String(activity[field.keys[0]]),
                          String(activity[field.keys[1]])
                        )
                      : String(activity[field.key])}
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="text-lg font-semibold">Honoraria</CardHeader>
        <CardContent>
          <Suspense fallback={<SkeletonHonorariumTable />}>
            <HonorariumTable />
          </Suspense>
        </CardContent>
        {honoraria && honoraria.length > 0 && (
          <CardFooter className="flex justify-center p-3">
            <ButtonGroup>
              {buttonData.map(({ title, isLoading, onClick }) => (
                <GeneratorButton
                  key={title}
                  title={title}
                  isLoading={isLoading}
                  onClick={onClick}
                />
              ))}
            </ButtonGroup>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
