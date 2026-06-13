import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRole, fetchActiveRoles } from './api';

const roleKeys = {
  all: ['roles'] as const,
};

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: roleKeys.all }),
  });
}

export const fetchActiveRolesOptions = () =>
  queryOptions({
    queryKey: roleKeys.all,
    queryFn: fetchActiveRoles,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

export const useActiveRoles = () => useQuery(fetchActiveRolesOptions());
