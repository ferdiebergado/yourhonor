import { api } from '@client/lib/http-client';
import type { Entity } from '@shared/schemas/base';
import type { PositionFormValues, PositionItem } from '@shared/schemas/position';

export const fetchPositions = async (): Promise<PositionItem[] | null> =>
  await api.get('/positions');

export const createPosition = async (data: PositionFormValues): Promise<Entity['id'] | null> =>
  await api.post('/create-position', data);
