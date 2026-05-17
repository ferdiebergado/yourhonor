import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { fetchSummary } from './api';

export const fetchSummaryOptions = () =>
  queryOptions({
    queryKey: ['summary'] as const,
    queryFn: fetchSummary,
    staleTime: 60 * 1000 * 5,
  });

export const useSummary = () => useSuspenseQuery(fetchSummaryOptions());
