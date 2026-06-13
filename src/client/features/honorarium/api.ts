import { ApiError } from '@client/lib/errors';
import { api } from '@client/lib/http-client';
import { startDownload } from '@client/lib/utils';
import { API_BASE_URL } from '@shared/constants';
import type { HonorariumFormValues } from '@shared/schemas/honorarium';
import type { ApiResponse } from '@shared/types';

export const createHonorarium = async (data: HonorariumFormValues): Promise<void | null> =>
  await api.post('/honoraria', data);

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
    res = await fetch(`${API_BASE_URL}/activities/${code}${url}`, { method: 'POST' });
  } catch (error) {
    throw new Error('Network error', { cause: error });
  }

  if (!res.ok) {
    // eslint-disable-next-line unicorn/no-null
    if (res.status === 401) return null;

    const body = (await res.json()) as ApiResponse;

    if (!body.success) throw new ApiError(body, res.status);
  }

  await startDownload(res, filename);
}
