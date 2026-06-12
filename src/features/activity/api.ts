import { api } from '@/lib/http-client';
import {
  type ActivityFormValues,
  type ActivityInfo,
  type ActivityWithHonoraria,
} from '@shared/schemas/activity';

const BASE_URL = '/activities' as const;

const codeParam = (code: string) => `code=${encodeURIComponent(code)}`;

const paths = {
  all: '/activities' as const,
  create: '/create-activity' as const,
  update: (code: string): string => `/update-activity?${codeParam(code)}` as const,
  byCode: (code: string): string => `/${BASE_URL}/${encodeURIComponent(code)}` as const,
};

export const createActivity = async (data: ActivityFormValues): Promise<ActivityInfo | null> =>
  await api.post(paths.create, data);

export const fetchActivities = async (): Promise<ActivityInfo[] | null> => await api.get(paths.all);

export const fetchActivity = async (code: string): Promise<ActivityWithHonoraria | null> =>
  await api.get(paths.byCode(code));

export const updateActivity = async (
  code: string,
  data: ActivityFormValues
): Promise<undefined | null> => await api.put(paths.update(code), data);
