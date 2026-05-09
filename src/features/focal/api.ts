import { api } from '@/lib/http-client';
import type { FocalBase, FocalFormValues } from '@shared/schemas/focal';

export const fetchFocals = async () => await api.get<FocalBase[]>('/focals');

export const createFocal = async (data: FocalFormValues): Promise<number | null> =>
  await api.post('/create-focal', data);
