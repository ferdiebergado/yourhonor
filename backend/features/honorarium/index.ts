import type { HonorariumDetail } from '@shared/schemas/honorarium';
import { formatAmount, getFullName, getMaxSalary, toDateRange } from '@shared/utils';
import { certification } from './certification';
import { computation } from './computation';
import { amountToWords, patchDoc } from './utils';

type Document = {
  filename: string;
  doc: Buffer;
};

export async function generateCertification(data: HonorariumDetail[]): Promise<Document> {
  if (data.length === 0) throw new Error('cannot generate certification: no data provided');

  const firstPayment = data[0];
  const filename = 'certification-' + firstPayment.activityCode;

  const patches = await createCertPatches(firstPayment);
  const firstCert = await patchDoc(certification, patches);

  if (data.length === 1) return { doc: firstCert, filename };

  const patchDocs = data.slice(1).map(async payment => {
    const patches = await createCertPatches(payment);
    const patched = await patchDoc(certification, patches);

    return patched;
  });

  const patchedDocs = await Promise.all(patchDocs);

  const { mergeDocx } = await import('@benedicte/docx-merge');
  let doc = firstCert;
  for (const curr of patchedDocs) {
    const merged = mergeDocx(doc, curr, { insertEnd: true });
    if (!merged) throw new Error('failed to merge documents');
    doc = merged;
  }

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

async function createCertPatches(honorarium: HonorariumDetail): Promise<CertificationPatches> {
  return {
    payee: getFullName({
      firstname: honorarium.firstname,
      mi: honorarium.mi,
      lastname: honorarium.lastname,
    }).toLocaleUpperCase(),
    role: honorarium.role,
    activity: honorarium.activityTitle,
    venue: honorarium.venue,
    end_date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    amount: formatAmount(honorarium.amount),
    tax: honorarium.taxRate.toString(),
    focal: getFullName({
      firstname: honorarium.focalFirstname,
      mi: honorarium.focalMi,
      lastname: honorarium.focalLastname,
    }).toLocaleUpperCase(),
    position: honorarium.position,
    date: toDateRange(honorarium.startDate, honorarium.endDate),
    amount_words: await amountToWords(honorarium.amount),
  };
}

type ComputationPatches = {
  payee: string;
  role: string;
  activity: string;
  bank: string;
  bank_branch: string;
  date: string;
  account_name: string;
  account_no: string;
  honorarium: string;
  actual_honorarium: string;
  net_honorarium: string;
  tin: string;
  focal: string;
  position: string;
  salary: string;
  hours: string;
};

export async function genComp(honoraria: HonorariumDetail[]): Promise<Document> {
  const firstPayment = honoraria[0];
  const activityCode = firstPayment.activityCode;
  const filename = 'computation-' + activityCode;

  const patches = createCompPatches(firstPayment);
  const firstComp = await patchDoc(computation, patches);

  if (honoraria.length === 1) return { doc: firstComp, filename };

  const patchDocs = honoraria.slice(1).map(async honorarium => {
    const patches = createCompPatches(honorarium);
    return await patchDoc(computation, patches);
  });

  const patchedDocs = await Promise.all(patchDocs);

  const { mergeDocx } = await import('@benedicte/docx-merge');

  let doc = firstComp;

  for (const curr of patchedDocs) {
    const merged = mergeDocx(doc, curr, { insertEnd: true });
    if (!merged) throw new Error('failed to merge documents');
    doc = merged;
  }

  return { doc, filename };
}

export function createCompPatches(honorarium: HonorariumDetail): ComputationPatches {
  const salary = getMaxSalary(honorarium.salary);

  const payee = getFullName({
    firstname: honorarium.firstname,
    mi: honorarium.mi,
    lastname: honorarium.lastname,
  }).toLocaleUpperCase();

  const tags: ComputationPatches = {
    payee,
    honorarium: formatAmount(honorarium.amount),
    focal: getFullName({
      firstname: honorarium.focalFirstname,
      mi: honorarium.focalMi,
      lastname: honorarium.focalLastname,
    }).toLocaleUpperCase(),
    date: toDateRange(honorarium.startDate, honorarium.endDate),
    bank_branch: honorarium.branch,
    account_name: payee,
    account_no: honorarium.accountNumber,
    actual_honorarium: formatAmount(honorarium.actual),
    net_honorarium: formatAmount(honorarium.net),
    salary: formatAmount(salary),
    hours: honorarium.hoursRendered.toString(),
    role: honorarium.role,
    activity: honorarium.activityTitle,
    bank: honorarium.bank,
    tin: honorarium.tin ?? '',
    position: honorarium.position,
  };

  return tags;
}
