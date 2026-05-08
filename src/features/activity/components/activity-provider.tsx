import { type ReactNode } from 'react';
import { useParams } from 'react-router';
import { ActivityCodeContext } from '../hooks';

type ActivityProviderProps = {
  children: ReactNode;
};

export default function ActivityCodeProvider({ children }: ActivityProviderProps) {
  const params = useParams();

  return <ActivityCodeContext value={params.code}>{children}</ActivityCodeContext>;
}
