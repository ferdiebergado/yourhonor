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

const getActiveRolesOptions = () =>
  queryOptions({
    queryKey: roleKeys.all,
    queryFn: fetchActiveRoles,
  });

export const useActiveRoles = () => useQuery(getActiveRolesOptions());
