import { api } from '@/lib/http-client';
import type { RoleBase, RoleFormValues } from '@shared/schemas/role';

export const createRole = async (data: RoleFormValues): Promise<number | null> =>
  await api.post('/create-role', data);

export const fetchActiveRoles = async (): Promise<RoleBase[] | null> => await api.get('/roles');
