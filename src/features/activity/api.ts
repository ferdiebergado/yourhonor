import { api } from '@/lib/http-client';
import { type ActivityDetail, type ActivityFormValues } from '@shared/schemas/activity';

export const createActivity = async (data: ActivityFormValues): Promise<ActivityDetail | null> =>
  await api.post('/create-activity', data);

export const fetchActivities = async (): Promise<ActivityDetail[] | null> =>
  await api.get('/activities');

export const fetchActivity = async (code: string): Promise<ActivityDetail | null> =>
  await api.get('/activity?code=' + encodeURIComponent(code));
