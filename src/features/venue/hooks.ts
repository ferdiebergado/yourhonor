import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createVenue, fetchVenues } from './api';

const QUERY_KEYS = {
  venues: ['venues'] as const,
};

const fetchVenuesOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.venues,
    queryFn: fetchVenues,
  });

export const useVenues = () => useQuery(fetchVenuesOptions());

export const useCreateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.venues });
    },
  });
};
