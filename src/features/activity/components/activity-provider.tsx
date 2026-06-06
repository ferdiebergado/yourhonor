import type { ReactNode } from 'react';
import { useParams } from 'react-router';
import { ActivityContext, useActivity } from '../hooks';

type ActivityProviderProps = {
  children: ReactNode;
};

export default function ActivityProvider({ children }: ActivityProviderProps) {
  const { code } = useParams();
  const { data: activity } = useActivity(code ?? '');

  // eslint-disable-next-line unicorn/no-null
  if (!activity) return null;

  return <ActivityContext value={activity}>{children}</ActivityContext>;
}
