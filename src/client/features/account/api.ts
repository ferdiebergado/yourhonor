import { api } from '@client/lib/http-client';
import type { AccountDetail, AccountFormValues } from '@shared/schemas/account';
import type { Entity } from '@shared/schemas/base';

const URL = '/accounts' as const;

export const fetchActiveAccounts = async (): Promise<AccountDetail[] | null> => await api.get(URL);

export const createAccount = async (data: AccountFormValues): Promise<Entity['id'] | null> =>
  await api.post(URL, data);
