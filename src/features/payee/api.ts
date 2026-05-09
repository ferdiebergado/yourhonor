import { api } from '@/lib/http-client';
import type { PayeeBase, PayeeFormValues } from '@shared/schemas/payee';

export const createPayee = async (data: PayeeFormValues): Promise<number | null> =>
  await api.post('/create-payee', data);

export const fetchActivePayees = async (): Promise<PayeeBase[] | null> => await api.get('/payees');
