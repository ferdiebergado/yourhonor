import { api } from '@/lib/http-client';
import type { HonorariumDetail, HonorariumFormValues } from '@shared/schemas/honorarium';

export const createHonorarium = async (data: HonorariumFormValues) =>
  await api.post('/create-honorarium', data);

export const fetchActiveHonorariaByActivity = async (
  code: string
): Promise<HonorariumDetail[] | null> => await api.get('/honoraria?code=' + code);
