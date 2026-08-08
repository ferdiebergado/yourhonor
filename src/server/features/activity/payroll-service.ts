import {
  Colors,
  NumFmt,
  type BorderStyle,
  type Cell,
} from '@node-projects/excelforge';

import { db } from '@server/db';
import logger from '@server/logger';
import { decrypt } from '@server/security';
import type { ActivityDetail } from '@shared/schemas/activity';
import type { HonorariumDetail } from '@shared/schemas/honorarium';
import { formatDateRange } from '@shared/utils';
import {
  findActiveHonorariaWithAccountByActivity,
  recordUsage,
} from '../honorarium/repo';
import { getFundCluster } from '../honorarium/utils';
import type { Document } from '../types';
import { formatName, formatVenue } from '../utils';
import { payroll } from './payroll';
import { findActiveActivityDetailByUser } from './repo';

const SHEET = 'PAYROLL';
const START_ROW = 13;
const HONORARIUM_COL = 'J';
const TAX_COL = 'K';
const NET_COL = 'L';
const GROSS_COL_NUM = 10; // J
const NET_COL_NUM = 12; // L
const FONT = 'Book Antiqua';
const FONT_SIZE = 9;
const BORDER_STYLE = 'medium' satisfies BorderStyle;

/**
 * Generate payroll document for the given activity and user.
 * Returns undefined when activity/honoraria can't be found.
 */
export async function generatePayroll(
  activityCode: string,
  userId: number,
): Promise<Document | undefined> {
  const activity = await findActiveActivityDetailByUser(
    db,
    activityCode,
    userId,
  );
  if (!activity) {
    logger.warn(`Activity not found: ${activityCode} for user ${userId}`);
    return;
  }

  const honoraria = await findActiveHonorariaWithAccountByActivity(
    db,
    activityCode,
    userId,
  );

  if (honoraria.length === 0) {
    logger.warn(`No honoraria found for activity: ${activityCode}`);
    return;
  }

  const doc = await genPayrollDoc(activity, honoraria);

  await recordUsage(db, 'Payroll', userId);

  return doc;
}

/**
 * Format date of birth for Excel
 */
function formatDob(dob: string | null | undefined): string {
  if (!dob) return '';
  return Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(dob));
}

/**
 * Safely decrypt account number.
 * Accepts ArrayBuffer | Buffer | Uint8Array and returns '' on failure.
 */
function getDecryptedAccountNo(
  accountNo?: ArrayBuffer | Buffer | Uint8Array | null,
): string {
  if (!accountNo) return '';
  try {
    // Buffer.from handles Buffer | ArrayBuffer | Uint8Array
    return decrypt(Buffer.from(accountNo as any));
  } catch (err) {
    // Log minimal context and avoid leaking sensitive data.
    logger.error({ err }, 'Failed to decrypt account number');
    return '';
  }
}

/**
 * Shallow merge for plain style objects.
 * Note: excelforge style builders may return complex objects — only merge when both are plain objects.
 */
function mergeStyles(a: Record<string, unknown>, b?: Record<string, unknown>) {
  if (!b) return a;
  return { ...a, ...b };
}

/**
 * Generate payroll Excel document. Errors are logged with context and rethrown.
 */
async function genPayrollDoc(
  activity: ActivityDetail,
  honoraria: HonorariumDetail[],
): Promise<Document> {
  const { Workbook, style } = await import('@node-projects/excelforge');
  let workbook;
  try {
    workbook = await Workbook.fromBase64(payroll);
  } catch (err) {
    logger.error(
      { err, activityCode: activity.code },
      'Failed to load payroll workbook',
    );
    throw err;
  }

  const sheet = workbook.getSheet(SHEET);
  if (!sheet) throw new Error(`Workbook does not have a sheet named ${SHEET}.`);

  const { title, venue, startDate, endDate, code, location } = activity;

  const fundCluster = getFundCluster(code);
  const fundClusterCell = sheet.getCell(7, 1);
  const fundClusterText = `${String(fundClusterCell.value)} ${fundCluster}`;
  sheet.getCell(7, 1).value = fundClusterText;

  const particularsCell = sheet.getCell(9, 1);
  const particulars = `${String(particularsCell.value)} ${title} held at ${formatVenue(venue, location)} on ${formatDateRange(startDate, endDate)}`;
  particularsCell.value = particulars;

  const baseStyle = style()
    .font({ name: FONT, size: FONT_SIZE, bold: true })
    .border(BORDER_STYLE)
    .build();

  const withBottomBorder = style().borderBottom(BORDER_STYLE).build();
  const decimalFormat = style().numFmt(NumFmt.Decimal2).build();

  let currentRow = START_ROW;

  for (const [index, honorarium] of honoraria.entries()) {
    // The template appears to contain two sample rows; insert only when beyond them.
    if (index > 1) sheet.insertRows(currentRow, 1);

    // merge and set bottom border for columns F-G (6-7); preserve existing template merges
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

    // Normalize numeric values defensively
    const numericAmount = Number(amount ?? 0) || 0;
    const taxRatePct = Number((honorarium as any).taxRate ?? 0) || 0; // defensive

    const taxMultiplier = taxRatePct / 100;
    // Limit decimal precision for inline formula to avoid long floats
    const taxMultiplierStr = Number.isFinite(taxMultiplier)
      ? taxMultiplier.toFixed(6)
      : '0';

    const cells: Cell[] = [
      // Sequence
      { value: seq },
      // Payee
      { value: formatName({ firstname, mi, lastname }) },
      // Account Number
      { value: getDecryptedAccountNo(accountNo as any) },
      // Bank
      { value: bank },
      // Bank Branch
      {
        value: bankBranch,
        style: withBottomBorder,
      },
      // TIN
      { value: tin },
      // Date of Birth
      { value: formatDob(dob) },
      // Gross Honorarium
      {
        value: numericAmount,
        style: decimalFormat,
      },
      // Tax (formula uses HONORARIUM_COL * tax rate)
      {
        style: decimalFormat,
        formula: `${HONORARIUM_COL}${currentRow}*${taxMultiplierStr}`,
      },
      // Net Honorarium
      {
        style: decimalFormat,
        formula: `${HONORARIUM_COL}${currentRow}-${TAX_COL}${currentRow}`,
      },
      // Sequence (keep as in template)
      { value: seq },
      // Signature
      {
        value: '',
        style: style().border(BORDER_STYLE).build(),
      },
    ];

    for (const [i, cell] of cells.entries()) {
      let col = i + 1;

      // account for a gap in the template (original code offset)
      if (i >= 5) col = i + 3;

      // Prefer using baseStyle unless a plain object style was provided, then shallow-merge
      const baseStylePlain =
        typeof baseStyle === 'object'
          ? (baseStyle as Record<string, unknown>)
          : {};
      const cellStylePlain =
        typeof cell.style === 'object'
          ? (cell.style as Record<string, unknown>)
          : undefined;
      cell.style = mergeStyles(baseStylePlain, cellStylePlain) as any;

      sheet.setCell(currentRow, col, cell);
    }

    // Keep original merge pattern used in template
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

  let docBuffer: Uint8Array;
  try {
    docBuffer = await workbook.build();
  } catch (err) {
    logger.error(
      { err, activityCode: activity.code },
      'Failed to build payroll workbook',
    );
    throw err;
  }

  const filename = `Payroll-${code}-${Date.now()}.xlsx`;

  return {
    doc: docBuffer,
    filename,
  };
}
