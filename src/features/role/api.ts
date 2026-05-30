import { api } from '@/lib/http-client';
import type { RoleFormValues, RoleItem } from '@shared/schemas/role';

export const createRole = async (data: RoleFormValues): Promise<number | null> =>
  await api.post('/create-role', data);

export const fetchActiveRoles = async (): Promise<RoleItem[] | null> => await api.get('/roles');
