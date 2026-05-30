import { api } from '@/lib/http-client';
import type { AccountDetail, AccountFormValues } from '@shared/schemas/account';
import type { Entity } from '@shared/schemas/base';

export const fetchActiveAccounts = async (): Promise<AccountDetail[] | null> =>
  await api.get('/accounts');

export const createAccount = async (data: AccountFormValues): Promise<Entity['id'] | null> =>
  await api.post('/create-account', data);
