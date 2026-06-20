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
import { useNavigate, useParams } from 'react-router';

import { Button } from '@client/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@client/components/ui/item';
import HonorariaCard from '@client/features/honorarium/components/honoraria-card';
import type { ActivityDetail } from '@shared/schemas/activity';
import { formatDate, formatDateRange, getFullName } from '@shared/utils';
import { useActivity } from '../hooks';

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
  { key: 'position', label: 'Focal Position', icon: <RiPencilRulerLine /> },
  { key: 'code', label: 'Activity Code', icon: <RiBarcodeLine /> },
  { key: 'fundSource', label: 'Fund Source', icon: <RiBankLine /> },
];

export default function ActivityPage() {
  const { code: activityCode } = useParams<{ code?: string }>();
  const { data: activity } = useActivity(activityCode as string);
  const navigate = useNavigate();

  // eslint-disable-next-line unicorn/no-null
  if (!activity) return null;

  const { title, code, createdAt, honoraria } = activity;

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription>Created on {formatDate(createdAt)}</CardDescription>
          <CardAction>
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() => navigate(`/activities/${code}/edit`)}
            >
              <RiBallPenFill className="size-5" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activityFields.map((field, index) => (
              <Item className="p-0" key={index}>
                {field.icon && <ItemMedia variant="icon">{field.icon}</ItemMedia>}
                <ItemContent>
                  <ItemTitle>
                    {isMultiFieldConfig(field)
                      ? field.format(
                          String(activity[field.keys[0]]),
                          String(activity[field.keys[1]])
                        )
                      : String(activity[field.key])}
                  </ItemTitle>
                  <ItemDescription>{field.label}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>
        </CardContent>
      </Card>
      <HonorariaCard activityCode={code} honoraria={honoraria} />
    </div>
  );
}
