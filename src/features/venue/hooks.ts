import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createVenue, fetchVenues } from './api';

const venueKeys = {
  all: ['venues'] as const,
};

const fetchVenuesOptions = () =>
  queryOptions({
    queryKey: venueKeys.all,
    queryFn: fetchVenues,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

export const useVenues = () => useQuery(fetchVenuesOptions());

export const useCreateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVenue,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: venueKeys.all }),
  });
};
