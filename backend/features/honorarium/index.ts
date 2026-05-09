import type { HonorariumDetail } from '@shared/schemas/honorarium';
import { formatAmount, getFullName, getMaxSalary, toDateRange } from '@shared/utils';
import type { CellValue } from 'exceljs';
import { certification } from './certification';
import { computation } from './computation';
import { ors } from './ors';
import { payroll } from './payroll';
import { amountToWords, getFundCluster, parseActivityCode, patchDoc } from './utils';

type Document = {
  filename: string;
  doc: Buffer;
};

export async function generateCertification(honoraria: HonorariumDetail[]): Promise<Document> {
  if (honoraria.length === 0) throw new Error('cannot generate certification: no data provided');

  const firstPayment = honoraria[0];
  const filename = 'certification-' + firstPayment.activityCode;

  const patches = await createCertPatches(firstPayment);
  const firstCert = await patchDoc(certification, patches);

  if (honoraria.length === 1) return { doc: firstCert, filename };

  const patchDocs = honoraria.slice(1).map(async payment => {
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
    account_name: honorarium.accountName,
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

export async function createORS(honoraria: HonorariumDetail[]) {
  const { default: Excel } = await import('exceljs');
  const workbook = new Excel.Workbook();
  const buf = Buffer.from(ors, 'base64');
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  await workbook.xlsx.load(arrayBuffer);

  const orsSheet = workbook.getWorksheet('ORS');
  if (!orsSheet) throw new Error('Workbook does not have a sheet named ORS.');

  const dvSheet = workbook.getWorksheet('DV');
  if (!dvSheet) throw new Error('Workbook does not have a sheet named DV.');

  const { firstname, mi, lastname, activityTitle, activityCode, venue, startDate, endDate } =
    honoraria[0];

  let payee = getFullName({ firstname: firstname, mi: mi, lastname: lastname }).toLocaleUpperCase();

  const numPayees = honoraria.length;
  let other = 'OTHER';
  if (numPayees > 2) other += 'S';
  if (numPayees > 1) payee += ` AND ${(numPayees - 1).toString()} ${other}`;

  orsSheet.getCell('E7').value = payee;
  dvSheet.getCell('F11').value = payee;

  const dateRange = toDateRange(startDate, endDate);

  const particulars = `To payment of honorarium as Resource Person during the ${activityTitle} held at ${venue} on ${dateRange}`;
  orsSheet.getCell('E16').value = particulars;
  dvSheet.getCell('B16').value = particulars;

  const amount = honoraria.reduce((acc, payment) => acc + payment.amount, 0);
  orsSheet.getCell('N16').value = amount;
  dvSheet.getCell('AC17').value = amount;

  orsSheet.getCell('E34').value = activityCode;
  orsSheet.getCell('K16').value = parseActivityCode(activityCode).mfoCode;

  return await workbook.xlsx.writeBuffer();
}

export async function createPayroll(honoraria: HonorariumDetail[]) {
  const { default: Excel } = await import('exceljs');
  const workbook = new Excel.Workbook();

  const sheetName = 'PAYROLL';
  const buf = Buffer.from(payroll, 'base64');
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  await workbook.xlsx.load(arrayBuffer);

  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) throw new Error(`Workbook does not have a sheet named ${sheetName}.`);

  const { activityCode, activityTitle, venue, startDate, endDate } = honoraria[0];

  const fundCluster = getFundCluster(activityCode);
  const fundClusterCell = sheet.getCell('A7');
  const fundClusterText = `${fundClusterCell.text} ${fundCluster}`;
  sheet.getCell('A7').value = fundClusterText;

  const particularsCell = sheet.getCell('A9');
  const particulars = `${particularsCell.text} ${activityTitle} held at ${venue} on ${toDateRange(startDate, endDate)}`;
  particularsCell.value = particulars;

  let currentRow = 13;

  for (const [index, honorarium] of honoraria.entries()) {
    if (index > 1) sheet.insertRow(currentRow, [], 'i');

    const num = index + 1;
    const { firstname, mi, lastname, position, branch, accountNumber, bank, tin, amount } =
      honorarium;
    const payee = getFullName({ firstname, mi, lastname });

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
        value: accountNumber,
      },
      {
        cell: 'E',
        value: bank,
      },
      {
        cell: 'F',
        value: branch,
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

  return await workbook.xlsx.writeBuffer();
}
