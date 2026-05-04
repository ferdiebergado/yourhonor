import type { RoleFormValues } from '@shared/schemas/role';
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createRole, fetchActiveRoles } from './api';

const QUERY_KEYS = {
  roles: ['roles'] as const,
};

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleFormValues) => createRole(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles }),
  });
}

const getActiveRolesOptions = () =>
  queryOptions({
    queryKey: QUERY_KEYS.roles,
    queryFn: fetchActiveRoles,
  });

export const useActiveRoles = () => useSuspenseQuery(getActiveRolesOptions());
