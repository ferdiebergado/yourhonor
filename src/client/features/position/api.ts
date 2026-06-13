import { api } from '@client/lib/http-client';
import type { Entity } from '@shared/schemas/base';
import type { PositionFormValues, PositionItem } from '@shared/schemas/position';

const BASE_URL = '/positions' as const;

export const fetchPositions = async (): Promise<PositionItem[] | null> => await api.get(BASE_URL);

export const createPosition = async (data: PositionFormValues): Promise<Entity['id'] | null> =>
  await api.post(BASE_URL, data);
