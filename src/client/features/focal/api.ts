import { api } from '@client/lib/http-client';
import type { FocalDetail, FocalFormValues } from '@shared/schemas/focal';

export const fetchFocals = async (): Promise<FocalDetail[] | null> => await api.get('/focals');

export const createFocal = async (data: FocalFormValues): Promise<number | null> =>
  await api.post('/create-focal', data);
