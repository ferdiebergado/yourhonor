import { api } from '@/lib/http-client';
import type { ActivityFormValues } from '@shared/schemas/activity';

export const createActivity = async (data: ActivityFormValues) =>
  await api.post('/create-activity', data);
