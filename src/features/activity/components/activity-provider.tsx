import type { ReactNode } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

import SkeletonCard from '@/components/skeleton-card';
import { ActivityContext, useActivity } from '../hooks';

type ActivityProviderProps = {
  children: ReactNode;
};

export default function ActivityProvider({ children }: ActivityProviderProps) {
  const { code } = useParams();
  const { isPending, isError, error, data: activity } = useActivity(code);

  if (isPending) return <SkeletonCard />;

  if (isError) {
    toast.error(error.message);
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  return <ActivityContext value={activity}>{children}</ActivityContext>;
}
