import { api } from '@client/lib/http-client';
import type { Entity } from '@shared/schemas/base';
import type { PayeeFormValues, PayeeItem } from '@shared/schemas/payee';

const BASE_URL = '/payees' as const;

export const createPayee = async (data: PayeeFormValues): Promise<Entity['id'] | null> =>
  await api.post(BASE_URL, data);

export const fetchActivePayees = async (): Promise<PayeeItem[] | null> => await api.get(BASE_URL);
