import { api } from '@client/lib/http-client';
import type { BankFormValues, BankItem } from '@shared/schemas/bank';

export const createBank = async (data: BankFormValues): Promise<number | null> =>
  await api.post('/create-bank', data);

export const fetchActiveBanks = async (): Promise<BankItem[] | null> => await api.get('/banks');
