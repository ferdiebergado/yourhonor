import { api } from '@client/lib/http-client';
import type { RoleFormValues, RoleItem } from '@shared/schemas/role';

const BASE_URL = '/roles' as const;

export const createRole = async (data: RoleFormValues): Promise<number | null> =>
  await api.post(BASE_URL, data);

export const fetchActiveRoles = async (): Promise<RoleItem[] | null> => await api.get(BASE_URL);
