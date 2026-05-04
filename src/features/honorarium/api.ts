import { api } from '@/lib/http-client';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';

export const createHonorarium = async (data: HonorariumFormValues) =>
  await api.post('/create-honorarium', data);
