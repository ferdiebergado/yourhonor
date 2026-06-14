import { NumFmt, type Cell } from '@node-projects/excelforge';

import { db } from '@server/db';
import { decrypt } from '@server/security';
import type { ActivityDetail } from '@shared/schemas/activity';
import type { HonorariumDetail } from '@shared/schemas/honorarium';
import { formatDateRange } from '@shared/utils';
import { findActiveHonorariaWithAccountByActivity, recordUsage } from '../honorarium/repo';
import { getFundCluster } from '../honorarium/utils';
import { payroll } from './payroll';
import { findActiveActivityDetailByUser } from './repo';
import type { Document } from './types';
import { formatName } from './utils';

export async function genPayrollDoc(
  activity: ActivityDetail,
  honoraria: HonorariumDetail[]
): Promise<Document> {
  const { Workbook, style } = await import('@node-projects/excelforge');
  const workbook = await Workbook.fromBase64(payroll);

  const sheetName = 'PAYROLL';
  const sheet = workbook.getSheet(sheetName);
  if (!sheet) throw new Error(`Workbook does not have a sheet named ${sheetName}.`);

  const { title, venue, startDate, endDate, code, position, location } = activity;

  const fundCluster = getFundCluster(code);
  const fundClusterCell = sheet.getCell(7, 1);
  const fundClusterText = `${fundClusterCell.value} ${fundCluster}`;
  sheet.getCell(7, 1).value = fundClusterText;

  const particularsCell = sheet.getCell(9, 1);
  const particulars = `${particularsCell.value} ${title} held at ${venue}, ${location} on ${formatDateRange(startDate, endDate)}`;
  particularsCell.value = particulars;

  const baseStyle = style()
    .font({ name: 'Book Antiqua', size: 9, bold: true })
    .border('medium')
    .build();

  let currentRow = 13;

  for (const [index, honorarium] of honoraria.entries()) {
    if (index > 1) sheet.insertRows(currentRow, 1);

    sheet.merge(currentRow, 6, currentRow, 7);
    sheet.setStyle(currentRow, 7, style().borderBottom('medium').build());

    const num = index + 1;
    const { firstname, mi, lastname, bankBranch, accountNo, bank, tin, amount } = honorarium;
    const payee = formatName({ firstname, mi, lastname });

    const cells: Cell[] = [
      {
        value: num,
      },
      {
        value: payee,
      },
      {
        value: position,
      },
      {
        value: decrypt(Buffer.from(accountNo)),
      },
      {
        value: bank,
      },
      {
        value: bankBranch,
      },
      {
        value: tin,
      },
      {
        value: amount,
        style: { numberFormat: { formatCode: NumFmt.Decimal2 } },
      },
      {
        style: { numberFormat: { formatCode: NumFmt.Decimal2 } },
        formula: `J${currentRow.toString()}*${(honorarium.taxRate / 100).toString()}`,
      },
      {
        style: { numberFormat: { formatCode: NumFmt.Decimal2 } },
        formula: `J${currentRow.toString()}-K${currentRow.toString()}`,
      },
      { value: num },
    ];

    for (const [i, cell] of cells.entries()) {
      let col = i + 1;

      if (i >= 6) col = i + 3;

      cell.style = { ...baseStyle, ...cell.style };
      sheet.setCell(currentRow, col, cell);
    }

    currentRow++;
  }

  sheet.markDirty();

  const doc = await workbook.build();
  const filename = `Payroll-${code}.xlsx`;

  return {
    doc,
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
