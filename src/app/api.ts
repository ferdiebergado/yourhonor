import { api } from '@/lib/http-client';

export const fetchSummary = async (): Promise<{
  totalActivities: number;
  totalHonoraria: number;
} | null> => await api.get('/summary');
