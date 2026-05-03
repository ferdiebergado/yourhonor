import { api } from '@/lib/http-client';
import type { Position, PositionBase, PositionFormValues } from '@shared/schemas/position';

export const fetchPositions = async () => await api.get<PositionBase[]>('/positions');

export const createPosition = async (data: PositionFormValues) =>
  await api.post<Position>('/create-position', data);
