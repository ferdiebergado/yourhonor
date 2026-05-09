import { api } from '@/lib/http-client';
import type { BankBase, BankFormValues } from '@shared/schemas/bank';

export const createBank = async (data: BankFormValues): Promise<number | null> =>
  await api.post('/create-bank', data);

export const fetchActiveBanks = async (): Promise<BankBase[] | null> => await api.get('/banks');
