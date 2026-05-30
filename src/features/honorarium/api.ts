import { api } from '@/lib/http-client';
import { startDownload } from '@/lib/utils';
import { API_BASE_URL } from '@shared/constants';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import type { ApiResponse } from '@shared/types';

const getfetchOptions = (code: string) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ code }),
});

export const createHonorarium = async (data: HonorariumFormValues): Promise<void | null> =>
  await api.post('/create-honorarium', data);

export async function genCert(code: string): Promise<void | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/certification`, getfetchOptions(code));

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
    const res = await fetch(`${API_BASE_URL}/computation`, getfetchOptions(code));

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

export async function genORS(code: string): Promise<void | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/ors`, getfetchOptions(code));

    if (!res.ok) {
      // eslint-disable-next-line unicorn/no-null
      if (res.status === 401) return null;

      const data = (await res.json()) as ApiResponse;

      if (!data.success) throw new Error(data.error.message);
    }

    const filename = `ORS-${code}.xlsx`;

    await startDownload(res, filename);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate ORS/DV', { cause: error });
  }
}

export async function genPayroll(code: string): Promise<void | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/payroll`, getfetchOptions(code));

    if (!res.ok) {
      // eslint-disable-next-line unicorn/no-null
      if (res.status === 401) return null;

      const data = (await res.json()) as ApiResponse;

      if (!data.success) throw new Error(data.error.message);
    }

    const filename = `Payroll-${code}.xlsx`;

    await startDownload(res, filename);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate Payroll', { cause: error });
  }
}
