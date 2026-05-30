import {
  RiBallPenFill,
  RiBankLine,
  RiBarcodeLine,
  RiCalendarLine,
  RiMapPin2Line,
  RiPencilRulerLine,
  RiUser3Line,
} from '@remixicon/react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import type { ActivityDetail, ActivityFormValues } from '@shared/schemas/activity';
import { formatDate, formatDateRange, getFullName } from '@shared/utils';
import { useActivityForm, useUpdateActivity } from '../hooks';
import ActivityDialog from './activity-dialog';

type SingleFieldConfig = { key: keyof ActivityDetail; label: string; icon?: ReactNode };

type MultiFieldConfig = {
  keys: [keyof ActivityDetail, keyof ActivityDetail];
  label: string;
  format: (val1: string, val2: string) => string;
  icon?: ReactNode;
};

type ActivityFieldConfig = SingleFieldConfig | MultiFieldConfig;

const isMultiFieldConfig = (field: ActivityFieldConfig): field is MultiFieldConfig =>
  'keys' in field && 'format' in field;

const activityFields: ActivityFieldConfig[] = [
  {
    keys: ['startDate', 'endDate'],
    label: 'Date of Conduct',
    format: (startDate: string, endDate: string) => formatDateRange(startDate, endDate),
    icon: <RiCalendarLine />,
  },
  {
    keys: ['venue', 'location'],
    label: 'Venue',
    format: (venue: string, location: string) => `${venue}, ${location}`,
    icon: <RiMapPin2Line />,
  },
  {
    keys: ['firstname', 'lastname'],
    label: 'Focal Person',
    format: (firstname: string, lastname: string) => getFullName({ firstname, lastname }),
    icon: <RiUser3Line />,
  },
  { key: 'position', label: 'Position', icon: <RiPencilRulerLine /> },
  { key: 'code', label: 'Activity Code', icon: <RiBarcodeLine /> },
  { key: 'fundSource', label: 'Fund Source', icon: <RiBankLine /> },
];

type ActivityCardProps = {
  activity: ActivityDetail;
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  const form = useActivityForm({
    title: activity?.title ?? '',
    code: activity?.code ?? '',
    venueId: activity?.venueId ?? 0,
    focalId: activity?.focalId ?? 0,
    startDate: activity?.startDate ?? '',
    endDate: activity?.endDate ?? '',
  });

  const { isPending, mutate: updateActivity } = useUpdateActivity(activity.code);

  const onSubmit = (values: ActivityFormValues) => {
    updateActivity(values, {
      onSuccess: () => toast.success('Activity updated successfully.'),
      onError: () => toast.error('Unable to update activity. Please try again.'),
    });
  };

  // eslint-disable-next-line unicorn/no-null
  if (!activity) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{activity.title}</CardTitle>
        <CardDescription>Created on {formatDate(activity.createdAt)}</CardDescription>
        <CardAction>
          <ActivityDialog
            title="Update Activity"
            description="Update the activity by editing the form below."
            form={form}
            trigger={
              <Button variant="ghost" size="icon-lg">
                <RiBallPenFill className="size-5" />
              </Button>
            }
            onSubmit={onSubmit}
            isPending={isPending}
            tooltip="Update Activity"
          />
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {activityFields.map((field, index) => (
            <Item className="p-0" key={index}>
              {field.icon && <ItemMedia variant="icon">{field.icon}</ItemMedia>}

              <ItemContent>
                <ItemTitle>{field.label}</ItemTitle>
                <ItemDescription>
                  {isMultiFieldConfig(field)
                    ? field.format(String(activity[field.keys[0]]), String(activity[field.keys[1]]))
                    : String(activity[field.key])}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
