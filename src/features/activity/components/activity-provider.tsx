import type { ReactNode } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

import { ActivityContext, useActivity } from '../hooks';
import ActivitySkeletonCard from './activity-skeleton-card';

type ActivityProviderProps = {
  children: ReactNode;
};

export default function ActivityProvider({ children }: ActivityProviderProps) {
  const { code } = useParams();
  const { isPending, isError, error, data: activity } = useActivity(code);

  if (isPending) return <ActivitySkeletonCard />;

  if (isError) {
    toast.error(error instanceof Error ? error.message : String(error));
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  return <ActivityContext value={activity}>{children}</ActivityContext>;
}
