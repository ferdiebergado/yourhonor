import { api } from '@/lib/http-client';
import {
  type ActivityDetail,
  type ActivityFormValues,
  type ActivityFullDetail,
} from '@shared/schemas/activity';

export const createActivity = async (data: ActivityFormValues) =>
  await api.post('/create-activity', data);

export const fetchDetailedActivities = async () =>
  await api.get<ActivityDetail[]>('/detailed-activities');

export const fetchActivity = async (code: string) =>
  await api.get<ActivityFullDetail>('/activity?code=' + code);
