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

export const fetchActivity = async (id: number) =>
  await api.get<ActivityFullDetail>('/activity?id=' + id.toString());
