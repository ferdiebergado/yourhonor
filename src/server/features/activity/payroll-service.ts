import {
  Colors,
  NumFmt,
  type BorderStyle,
  type Cell,
} from '@node-projects/excelforge';

import { db } from '@server/db';
import { decrypt } from '@server/security';
import type { ActivityDetail } from '@shared/schemas/activity';
import type { HonorariumDetail } from '@shared/schemas/honorarium';
import { formatDateRange } from '@shared/utils';
import {
  findActiveHonorariaWithAccountByActivity,
  recordUsage,
} from '../honorarium/repo';
import { getFundCluster } from '../honorarium/utils';
import { payroll } from './payroll';
import { findActiveActivityDetailByUser } from './repo';
import type { Document } from './types';
import { formatName } from './utils';

const SHEET = 'PAYROLL';
const START_ROW = 13;
const HONORARIUM_COL = 'J';
const NET_COL = 'L';
const GROSS_COL_NUM = 10;
const NET_COL_NUM = 12;
const TAX_COL = 'K';
const FONT = 'Book Antiqua';
const FONT_SIZE = 9;
const BORDER_STYLE = 'medium' satisfies BorderStyle;

async function genPayrollDoc(
  activity: ActivityDetail,
  honoraria: HonorariumDetail[],
): Promise<Document> {
  const { Workbook, style } = await import('@node-projects/excelforge');
  const workbook = await Workbook.fromBase64(payroll);

  const sheet = workbook.getSheet(SHEET);
  if (!sheet) throw new Error(`Workbook does not have a sheet named ${SHEET}.`);

  const { title, venue, startDate, endDate, code, location } = activity;

  const fundCluster = getFundCluster(code);
  const fundClusterCell = sheet.getCell(7, 1);
  const fundClusterText = `${String(fundClusterCell.value)} ${fundCluster}`;
  sheet.getCell(7, 1).value = fundClusterText;

  const particularsCell = sheet.getCell(9, 1);
  const particulars = `${String(particularsCell.value)} ${title} held at ${location.toLocaleLowerCase() === 'online' ? 'online' : `at ${venue}, ${location}`} on ${formatDateRange(startDate, endDate)}`;
  particularsCell.value = particulars;

  const baseStyle = style()
    .font({ name: FONT, size: FONT_SIZE, bold: true })
    .border(BORDER_STYLE)
    .build();

  const withBottomBorder = style().borderBottom(BORDER_STYLE).build();
  const decimalFormat = style().numFmt(NumFmt.Decimal2).build();

  let currentRow = START_ROW;

  for (const [index, honorarium] of honoraria.entries()) {
    if (index > 1) sheet.insertRows(currentRow, 1);

    sheet.merge(currentRow, 6, currentRow, 7);
    sheet.setStyle(currentRow, 7, withBottomBorder);

    const seq = index + 1;
    const {
      firstname,
      mi,
      lastname,
      bankBranch,
      accountNo,
      bank,
      tin,
      amount,
      dob,
    } = honorarium;
    const cells: Cell[] = [
      {
        value: seq,
      },
      {
        value: formatName({ firstname, mi, lastname }),
      },
      {
        value: decrypt(Buffer.from(accountNo)),
      },
      {
        value: bank,
      },
      {
        value: bankBranch,
        style: withBottomBorder,
      },
      {
        value: tin,
      },
      {
        value: dob
          ? Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeZone: 'UTC',
            }).format(new Date(dob))
          : '',
      },
      {
        value: amount,
        style: decimalFormat,
      },
      {
        style: decimalFormat,
        formula: `${HONORARIUM_COL}${currentRow}*${(honorarium.taxRate / 100).toString()}`,
      },
      {
        style: decimalFormat,
        formula: `${HONORARIUM_COL}${currentRow}-${TAX_COL}${currentRow}`,
      },
      { value: seq },
      {
        value: '',
        style: style().border(BORDER_STYLE).build(),
      },
    ];

    for (const [i, cell] of cells.entries()) {
      let col = i + 1;

      if (i >= 5) col = i + 3;

      cell.style = { ...baseStyle, ...cell.style };
      sheet.setCell(currentRow, col, cell);
    }

    sheet.mergeByRef(`E${currentRow}:G${currentRow}`);
    const fillerCell = {
      style: withBottomBorder,
    } satisfies Cell;
    sheet.setCell(currentRow, 6, fillerCell);

    currentRow++;
  }

  const totalStyle = style()
    .font({ name: FONT, size: FONT_SIZE, bold: true })
    .bg(Colors.LightGray)
    .numFmt(NumFmt.Decimal2)
    .build();

  const grossCell = {
    formula: `SUM(${HONORARIUM_COL}${START_ROW}:${HONORARIUM_COL}${currentRow - 1})`,
    style: totalStyle,
  } satisfies Cell;
  sheet.setCell(currentRow, GROSS_COL_NUM, grossCell);

  const netCell = {
    formula: `SUM(${NET_COL}${START_ROW}:${NET_COL}${currentRow - 1})`,
    style: totalStyle,
  } satisfies Cell;
  sheet.setCell(currentRow, NET_COL_NUM, netCell);

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
  userId: number,
): Promise<Document | undefined> {
  const activity = await findActiveActivityDetailByUser(
    db,
    activityCode,
    userId,
  );
  if (!activity) return;

  const honoraria = await findActiveHonorariaWithAccountByActivity(
    db,
    activityCode,
    userId,
  );
  if (honoraria.length === 0) return;

  const doc = await genPayrollDoc(activity, honoraria);

  await recordUsage(db, 'Payroll', userId);

  return doc;
}
