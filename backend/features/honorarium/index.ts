import { mergeDocx } from '@benedicte/docx-merge';
import type { HonorariumDetail } from '@shared/schemas/honorarium';
import { formatAmount, getFullName } from '@shared/utils';
import { certification } from './certification';
import { amountToWords, patchDoc, toDateRange } from './utils';

type Certification = {
  filename: string;
  doc: Buffer;
};

export async function generateCertification(data: HonorariumDetail[]): Promise<Certification> {
  if (data.length === 0) {
    throw new Error('cannot generate certification: no data provided');
  }

  const firstPayment = data[0];
  const filename = 'certification-' + firstPayment.activityCode;

  const patches = await createPatches(firstPayment);
  const firstCert = await patchDoc(certification, patches);

  if (data.length === 1) return { doc: firstCert, filename };

  const patchDocs = data.slice(1).map(async payment => {
    const patches = await createPatches(payment);
    const patched = await patchDoc(certification, patches);

    return patched;
  });

  const patchedDocs = await Promise.all(patchDocs);

  const doc = patchedDocs.reduce((acc, curr) => {
    const merged = mergeDocx(acc, curr, { insertEnd: true });
    if (!merged) throw new Error('failed to merge documents');
    return merged;
  }, firstCert);

  return { doc, filename };
}

export type CertificationData = {
  payee: string;
  role: string;
  activity: string;
  venue: string;
  honorarium: number;
  taxRate: number;
  focal: string;
  position: string;
  startDate: string;
  endDate: string;
  activityCode: string;
};

type CertificationPatches = {
  payee: string;
  role: string;
  activity: string;
  venue: string;
  focal: string;
  position: string;
  date: string;
  end_date: string;
  amount_words: string;
  amount: string;
  tax: string;
};

async function createPatches(data: HonorariumDetail): Promise<CertificationPatches> {
  return {
    payee: getFullName(data),
    role: data.role,
    activity: data.activityTitle,
    venue: data.venue,
    end_date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    amount: formatAmount(data.amount),
    tax: data.taxRate.toString(),
    focal: getFullName({
      firstname: data.focalFirstname,
      mi: data.focalMi,
      lastname: data.focalLastname,
    }),
    position: data.position,
    date: toDateRange(data.startDate, data.endDate),
    amount_words: await amountToWords(data.amount),
  };
}
