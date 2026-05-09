import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { fetchSummary } from './api';

const QUERY_KEYS = {
  summary: ['summary'] as const,
};

const fetchSummaryOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.summary,
    queryFn: fetchSummary,
  });

export const useSummary = () => useSuspenseQuery(fetchSummaryOptions());
