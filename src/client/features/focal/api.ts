import { api } from '@client/lib/http-client';
import type { FocalDetail, FocalFormValues } from '@shared/schemas/focal';

const BASE_URL = '/focals' as const;

export const fetchFocals = async (): Promise<FocalDetail[] | null> => await api.get(BASE_URL);

export const createFocal = async (data: FocalFormValues): Promise<number | null> =>
  await api.post(BASE_URL, data);
