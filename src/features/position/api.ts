import { api } from '@/lib/http-client';
import type { PositionBase, PositionFormValues } from '@shared/schemas/position';

export const fetchPositions = async () => await api.get<PositionBase[]>('/positions');

export const createPosition = async (data: PositionFormValues): Promise<number | null> =>
  await api.post('/create-position', data);
