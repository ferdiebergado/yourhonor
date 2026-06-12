import { api } from '@/lib/http-client';
import {
  type ActivityFormValues,
  type ActivityInfo,
  type ActivityWithHonoraria,
} from '@shared/schemas/activity';

const BASE_URL = '/activities' as const;

export const createActivity = async (data: ActivityFormValues): Promise<ActivityInfo | null> =>
  await api.post(BASE_URL, data);

export const fetchActivities = async (): Promise<ActivityInfo[] | null> => await api.get(BASE_URL);

export const fetchActivity = async (code: string): Promise<ActivityWithHonoraria | null> =>
  await api.get(`${BASE_URL}/${code}`);

export const updateActivity = async (
  code: string,
  data: ActivityFormValues
): Promise<undefined | null> => await api.put(`${BASE_URL}/${code}`, data);
