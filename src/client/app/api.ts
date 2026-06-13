import { api } from '@client/lib/http-client';
import type { Summary } from '@shared/types';

export const fetchSummary = async (): Promise<Summary | null> => await api.get('/summary');
