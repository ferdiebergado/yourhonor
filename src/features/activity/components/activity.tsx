import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import HonorariumTable from '@/features/honorarium/components/honorarium-table';
import SkeletonHonorariumTable from '@/features/honorarium/components/skeleton-honorarium-table';
import { formatDateRange } from '@/lib/utils';
import type { ActivityFullDetail } from '@shared/schemas/activity';
import { Suspense } from 'react';
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

export default function Activity() {
  const activityCode = useActivityCode();
  const { data: activity } = useActivity(activityCode);

  // eslint-disable-next-line unicorn/no-null
  if (!activity) return null;

  // Define activity fields for dynamic rendering
  const activityFields: ActivityFieldConfig[] = [
    { key: 'code', label: 'Code' },
    {
      keys: ['startDate', 'endDate'],
      label: 'Date Range',
      format: (startDate: string, endDate: string) => formatDateRange(startDate, endDate),
    },
    { key: 'venue', label: 'Venue' },
    { key: 'location', label: 'Location' },
    { key: 'focal', label: 'Focal Person' },
    { key: 'focalPosition', label: 'Position' },
  ];

  return (
    <div className="space-y-7">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{activity.title}</CardTitle>
          <div className="text-muted-foreground text-sm">Activity ID: {activity.id}</div>
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
      </Card>
    </div>
  );
}
