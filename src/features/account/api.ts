import { api } from '@/lib/http-client';
import type { AccountBase, AccountFormValues } from '@shared/schemas/account';

export const fetchActiveAccounts = async (): Promise<AccountBase[] | null> =>
  await api.get('/accounts');

export const createAccount = async (data: AccountFormValues): Promise<undefined | null> =>
  await api.post('/create-account', data);
