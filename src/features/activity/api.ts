import { api } from '@/lib/http-client';
import { type ActivityDetail, type ActivityFormValues } from '@shared/schemas/activity';

const BASE_URL = '/activity' as const;

const codeParam = (code: string) => `code=${encodeURIComponent(code)}`;

const paths = {
  all: '/activities' as const,
  create: '/create-activity',
  update: (code: string): string => `/update-activity?${codeParam(code)}` as const,
  byCode: (code: string): string => `${BASE_URL}?${codeParam(code)}` as const,
};

export const createActivity = async (data: ActivityFormValues): Promise<ActivityDetail | null> =>
  await api.post(paths.create, data);

export const fetchActivities = async (): Promise<ActivityDetail[] | null> =>
  await api.get(paths.all);

export const fetchActivity = async (code: string): Promise<ActivityDetail | null> =>
  await api.get(paths.byCode(code));

export const updateActivity = async (
  code: string,
  data: ActivityFormValues
): Promise<void | null> => await api.put(paths.update(code), data);
