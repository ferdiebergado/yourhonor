import type { CellValue } from 'exceljs';

import { db } from '@backend/db';
import { findActiveActivityDetailByUser } from '@backend/features/activity/repo';
import { decrypt } from '@backend/security';
import type { ActivityDetail } from '@shared/schemas/activity';
import type { HonorariumDetail, HonorariumDetailSafe } from '@shared/schemas/honorarium';
import {
  formatAmount,
  formatDate,
  formatDateRange,
  getFullName,
  getMaxSalary,
} from '@shared/utils';
import { certification } from './certification';
import { computation } from './computation';
import { ors } from './ors';
import { payroll } from './payroll';
import { findActiveHonorariaWithAccountByActivity, recordUsage } from './repo';
import { amountToWords, getFundCluster, parseActivityCode, patchDoc } from './utils';

type Document = {
  filename: string;
  doc: Uint8Array;
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

const buildCertPatches = async (
  activity: Pick<
    ActivityDetail,
    | 'title'
    | 'venue'
    | 'location'
    | 'firstname'
    | 'mi'
    | 'lastname'
    | 'startDate'
    | 'endDate'
    | 'position'
  >,
  honorarium: HonorariumDetail
): Promise<CertificationPatches> => ({
  payee: formatName({
    firstname: honorarium.firstname,
    mi: honorarium.mi,
    lastname: honorarium.lastname,
  }),
  role: honorarium.role,
  activity: activity.title,
  venue: `${activity.venue}, ${activity.location}`,
  end_date: formatDate(new Date()),
  amount: formatAmount(honorarium.amount),
  tax: honorarium.taxRate.toString(),
  focal: formatName({
    firstname: activity.firstname,
    mi: activity.mi,
    lastname: activity.lastname,
  }),
  position: activity.position,
  date: formatDateRange(activity.startDate, activity.endDate),
  amount_words: await amountToWords(honorarium.amount),
});

export async function genCertDoc(
  activity: ActivityDetail,
  honoraria: HonorariumDetail[]
): Promise<Document> {
  const { title, venue, firstname, mi, lastname, position, startDate, endDate, code, location } =
    activity;

  const honorarium = honoraria[0];
  const filename = 'certification-' + code;

  const activityDetails = {
    title,
    venue,
    firstname,
    mi,
    lastname,
    position,
    startDate,
    endDate,
    location,
  };
  const patches = await buildCertPatches(activityDetails, honorarium);
  const firstCert = await patchDoc(certification, patches);

  if (honoraria.length === 1) return { doc: firstCert, filename };

  const patchDocs = honoraria.slice(1).map(async payment => {
    const patches = await buildCertPatches(activityDetails, payment);
    const patched = await patchDoc(certification, patches);

    return patched;
  });

  const patchedDocs = await Promise.all(patchDocs);

  const { mergeDocx } = await import('@benedicte/docx-merge');
  let doc = firstCert;
  for (const currentDoc of patchedDocs) {
    const merged = mergeDocx(doc, currentDoc, { insertEnd: true });
    if (!merged) throw new Error('failed to merge documents');
    doc = merged;
  }

  return { doc, filename };
}

export async function generateCertification(
  activityCode: string,
  userId: number
): Promise<Document | undefined> {
  const activity = await findActiveActivityDetailByUser(db, activityCode, userId);
  if (!activity) return;

  const honoraria = await findActiveHonorariaWithAccountByActivity(db, activityCode, userId);
  if (honoraria.length === 0) return;

  const doc = await genCertDoc(activity, honoraria);
  await recordUsage(db, 'Certification', userId);

  return doc;
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

export function buildCompPatches(
  activity: Pick<
    ActivityDetail,
    'title' | 'venue' | 'firstname' | 'mi' | 'lastname' | 'startDate' | 'endDate' | 'position'
  >,
  honorarium: HonorariumDetail
): ComputationPatches {
  const salary = getMaxSalary(honorarium.salary);

  const payee = formatName({
    firstname: honorarium.firstname,
    mi: honorarium.mi,
    lastname: honorarium.lastname,
  });

  const focal = formatName({
    firstname: activity.firstname,
    mi: activity.mi,
    lastname: activity.lastname,
  });

  const tags: ComputationPatches = {
    payee,
    focal,
    honorarium: formatAmount(honorarium.amount),
    date: formatDateRange(activity.startDate, activity.endDate),
    bank_branch: honorarium.bankBranch,
    account_name: honorarium.accountName,
    account_no: decrypt(Buffer.from(honorarium.accountNo)),
    actual_honorarium: formatAmount(honorarium.actual),
    net_honorarium: formatAmount(honorarium.net),
    salary: formatAmount(salary),
    hours: honorarium.hoursRendered.toString(),
    role: honorarium.role,
    activity: activity.title,
    bank: honorarium.bank,
    tin: honorarium.tin ?? '',
    position: activity.position,
  };

  return tags;
}

export async function genCompDoc(
  activity: ActivityDetail,
  honoraria: HonorariumDetail[]
): Promise<Document> {
  const { title, venue, firstname, mi, lastname, position, startDate, endDate, code } = activity;

  const honorarium = honoraria[0];
  const filename = 'computation-' + code;

  const activityDetails = { title, venue, firstname, mi, lastname, position, startDate, endDate };

  const patches = buildCompPatches(activityDetails, honorarium);
  const firstComp = await patchDoc(computation, patches);

  if (honoraria.length === 1) return { doc: firstComp, filename };

  const patchDocs = honoraria.slice(1).map(async honorarium => {
    const patches = buildCompPatches(activityDetails, honorarium);
    return await patchDoc(computation, patches);
  });

  const patchedDocs = await Promise.all(patchDocs);

  const { mergeDocx } = await import('@benedicte/docx-merge');

  let doc = firstComp;

  for (const currentDoc of patchedDocs) {
    const merged = mergeDocx(doc, currentDoc, { insertEnd: true });
    if (!merged) throw new Error('failed to merge documents');
    doc = merged;
  }

  return { doc, filename };
}

export async function generateComputation(
  activityCode: string,
  userId: number
): Promise<Document | undefined> {
  const activity = await findActiveActivityDetailByUser(db, activityCode, userId);
  if (!activity) return;

  const honoraria = await findActiveHonorariaWithAccountByActivity(db, activityCode, userId);
  if (honoraria.length === 0) return;

  const doc = await genCompDoc(activity, honoraria);

  await recordUsage(db, 'Computation', userId);

  return doc;
}

export async function genORSDoc(
  activity: ActivityDetail,
  honoraria: HonorariumDetail[]
): Promise<Document> {
  const { title, venue, firstname, mi, lastname, startDate, endDate, code } = activity;

  const { default: Excel } = await import('exceljs');
  const workbook = new Excel.Workbook();
  const buf = Buffer.from(ors, 'base64');
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  await workbook.xlsx.load(arrayBuffer);

  const orsSheet = workbook.getWorksheet('ORS');
  if (!orsSheet) throw new Error('Workbook does not have a sheet named ORS.');

  const dvSheet = workbook.getWorksheet('DV');
  if (!dvSheet) throw new Error('Workbook does not have a sheet named DV.');

  let payee = formatName({ firstname: firstname, mi: mi, lastname: lastname });

  const numPayees = honoraria.length;
  let other = 'OTHER';
  if (numPayees > 2) other += 'S';
  if (numPayees > 1) payee += ` AND ${(numPayees - 1).toString()} ${other}`;

  orsSheet.getCell('E7').value = payee;
  dvSheet.getCell('F11').value = payee;

  const dateRange = formatDateRange(startDate, endDate);

  const particulars = `To payment of honorarium as Resource Person during the ${title} held at ${venue} on ${dateRange}`;
  orsSheet.getCell('E16').value = particulars;
  dvSheet.getCell('B16').value = particulars;

  const amount = honoraria.reduce((acc, payment) => acc + payment.amount, 0);
  orsSheet.getCell('N16').value = amount;
  dvSheet.getCell('AC17').value = amount;

  orsSheet.getCell('E34').value = code;
  orsSheet.getCell('K16').value = parseActivityCode(code).mfoCode;

  const excelBuffer = await workbook.xlsx.writeBuffer();

  const filename = `ORS-${code}.xlsx`;

  return {
    doc: new Uint8Array(excelBuffer),
    filename,
  };
}

export async function generateORS(
  activityCode: string,
  userId: number
): Promise<Document | undefined> {
  const activity = await findActiveActivityDetailByUser(db, activityCode, userId);
  if (!activity) return;

  const honoraria = await findActiveHonorariaWithAccountByActivity(db, activityCode, userId);
  if (honoraria.length === 0) return;

  const doc = await genORSDoc(activity, honoraria);

  await recordUsage(db, 'ORS-DV', userId);

  return doc;
}

export async function genPayrollDoc(
  activity: ActivityDetail,
  honoraria: HonorariumDetail[]
): Promise<Document> {
  const { default: Excel } = await import('exceljs');
  const workbook = new Excel.Workbook();

  const sheetName = 'PAYROLL';
  const buf = Buffer.from(payroll, 'base64');
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  await workbook.xlsx.load(arrayBuffer);

  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) throw new Error(`Workbook does not have a sheet named ${sheetName}.`);

  const { title, venue, startDate, endDate, code, position } = activity;

  const fundCluster = getFundCluster(code);
  const fundClusterCell = sheet.getCell('A7');
  const fundClusterText = `${fundClusterCell.text} ${fundCluster}`;
  sheet.getCell('A7').value = fundClusterText;

  const particularsCell = sheet.getCell('A9');
  const particulars = `${particularsCell.text} ${title} held at ${venue} on ${formatDateRange(startDate, endDate)}`;
  particularsCell.value = particulars;

  let currentRow = 13;

  for (const [index, honorarium] of honoraria.entries()) {
    if (index > 1) sheet.insertRow(currentRow, [], 'i');

    const num = index + 1;
    const { firstname, mi, lastname, bankBranch, accountNo, bank, tin, amount } = honorarium;
    const payee = formatName({ firstname, mi, lastname });

    const cells: { cell: string; value: CellValue }[] = [
      {
        cell: 'A',
        value: num,
      },
      {
        cell: 'B',
        value: payee,
      },
      {
        cell: 'C',
        value: position,
      },
      {
        cell: 'D',
        value: decrypt(Buffer.from(accountNo)),
      },
      {
        cell: 'E',
        value: bank,
      },
      {
        cell: 'F',
        value: bankBranch,
      },
      {
        cell: 'I',
        value: tin,
      },
      {
        cell: 'J',
        value: amount,
      },
      {
        cell: 'K',
        value: { formula: `J${currentRow.toString()}*${(honorarium.taxRate / 100).toString()}` },
      },
      {
        cell: 'L',
        value: { formula: `J${currentRow.toString()}-K${currentRow.toString()}` },
      },
      {
        cell: 'M',
        value: num,
      },
    ];

    for (const { cell, value } of cells) sheet.getRow(currentRow).getCell(cell).value = value;

    currentRow++;
  }

  const excelBuffer = await workbook.xlsx.writeBuffer();
  const filename = `Payroll-${code}.xlsx`;

  return {
    doc: new Uint8Array(excelBuffer),
    filename,
  };
}

export async function generatePayroll(
  activityCode: string,
  userId: number
): Promise<Document | undefined> {
  const activity = await findActiveActivityDetailByUser(db, activityCode, userId);
  if (!activity) return;

  const honoraria = await findActiveHonorariaWithAccountByActivity(db, activityCode, userId);
  if (honoraria.length === 0) return;

  const doc = await genPayrollDoc(activity, honoraria);

  await recordUsage(db, 'Payroll', userId);

  return doc;
}

export const stripAccountNo = (honoraria: HonorariumDetail[]): HonorariumDetailSafe[] =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  honoraria.map(({ accountNo, ...honorarium }) => honorarium);

const formatName = ({
  firstname,
  mi,
  lastname,
}: {
  firstname: string;
  mi?: string | null;
  lastname: string;
}) =>
  getFullName({
    firstname,
    mi,
    lastname,
  }).toLocaleUpperCase();
