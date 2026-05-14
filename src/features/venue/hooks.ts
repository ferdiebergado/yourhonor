import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createVenue, fetchVenues } from './api';

const venueKeys = {
  all: ['venues'] as const,
};

const fetchVenuesOptions = () =>
  queryOptions({
    queryKey: venueKeys.all,
    queryFn: fetchVenues,
  });

export const useVenues = () => useQuery(fetchVenuesOptions());

export const useCreateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.all });
    },
  });
};
