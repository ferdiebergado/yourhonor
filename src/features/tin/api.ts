import { api } from '@/lib/http-client';
import type { TinBase, TinFormValues } from '@shared/schemas/tin';

export const createTIN = async (data: TinFormValues): Promise<undefined | null> =>
  await api.post('/create-tin', data);

export const fetchActiveTINs = async (): Promise<TinBase[] | null> => await api.get('/tins');
