import { api } from '@/lib/http-client';
import { startDownload } from '@/lib/utils';
import { API_BASE_URL } from '@shared/constants';
import type { HonorariumDetail, HonorariumFormValues } from '@shared/schemas/honorarium';
import type { ApiResponse } from '@shared/types';

export const createHonorarium = async (data: HonorariumFormValues) =>
  await api.post('/create-honorarium', data);

export const fetchActiveHonorariaByActivity = async (
  code: string
): Promise<HonorariumDetail[] | null> =>
  await api.get('/honoraria?code=' + encodeURIComponent(code));

export async function genCert(code: string): Promise<void | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/certification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      // eslint-disable-next-line unicorn/no-null
      if (res.status === 401) return null;

      const data = (await res.json()) as ApiResponse;

      if (!data.success) throw new Error(data.error.message);
    }

    const filename = `certification-${code}.docx`;

    await startDownload(res, filename);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate certification', { cause: error });
  }
}

export async function genComp(code: string): Promise<void | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/computation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      // eslint-disable-next-line unicorn/no-null
      if (res.status === 401) return null;

      const data = (await res.json()) as ApiResponse;

      if (!data.success) throw new Error(data.error.message);
    }

    const filename = `computation-${code}.docx`;

    await startDownload(res, filename);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate computation', { cause: error });
  }
}
