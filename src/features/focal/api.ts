import { api } from '@/lib/http-client';
import type { FocalBase } from '@shared/schemas/focal';

export const fetchFocals = async () => await api.get<FocalBase[]>('/focals');
