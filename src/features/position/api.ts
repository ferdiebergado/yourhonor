import { api } from '@/lib/http-client';
import type { PositionBase } from '@shared/schemas/position';

export const fetchPositions = async () => await api.get<PositionBase[]>('/positions');
