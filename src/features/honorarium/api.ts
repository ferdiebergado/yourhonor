import { AuthenticationError } from '@/lib/errors';
import { api } from '@/lib/http-client';
import { startDownload } from '@/lib/utils';
import { API_BASE_URL } from '@shared/constants';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import type { ApiResponse } from '@shared/types';

export const createHonorarium = async (data: HonorariumFormValues): Promise<void | null> =>
  await api.post('/create-honorarium', data);

export const genCert = async (code: string): Promise<void | null> =>
  await downloadReport('/certification', code, `certification-${code}.docx`);

export const genComp = async (code: string): Promise<void | null> =>
  await downloadReport('/computation', code, `computation-${code}.docx`);

export const genORS = async (code: string): Promise<void | null> =>
  await downloadReport('/ors', code, `ORS-${code}.xlsx`);

export const genPayroll = async (code: string): Promise<void | null> =>
  await downloadReport('/payroll', code, `Payroll-${code}.xlsx`);

async function downloadReport(url: string, code: string, filename: string) {
  let res: Response;

  try {
    res = await fetch(`${API_BASE_URL}${url}`, getfetchOptions(code));
  } catch (error) {
    throw new Error('Network error', { cause: error });
  }

  if (!res.ok) {
    if (res.status === 401) throw new AuthenticationError();

    const body = (await res.json()) as ApiResponse;

    if (!body.success) throw new Error(body.error.message);
  }

  await startDownload(res, filename);
}

const getfetchOptions = (code: string) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ code }),
});
