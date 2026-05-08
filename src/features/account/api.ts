import { api } from '@/lib/http-client';
import type { AccountDetail, AccountFormValues } from '@shared/schemas/account';

export const fetchActiveAccounts = async (): Promise<AccountDetail[] | null> =>
  await api.get('/accounts');

export const createAccount = async (data: AccountFormValues): Promise<undefined | null> =>
  await api.post('/create-account', data);
