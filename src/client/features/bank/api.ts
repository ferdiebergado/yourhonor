import { api } from '@client/lib/http-client';
import type { BankFormValues, BankItem } from '@shared/schemas/bank';

const BASE_URL = '/banks' as const;

export const createBank = async (data: BankFormValues): Promise<number | null> =>
  await api.post(BASE_URL, data);

export const fetchActiveBanks = async (): Promise<BankItem[] | null> => await api.get(BASE_URL);
