import type { XMLParser } from 'fast-xml-parser';

import { db } from '@server/db';
import type { ActivityDetail } from '@shared/schemas/activity';
import type { HonorariumDetail } from '@shared/schemas/honorarium';
import { formatDateRange } from '@shared/utils';
import { findActiveHonorariaWithAccountByActivity, recordUsage } from '../honorarium/repo';
import { parseActivityCode } from '../honorarium/utils';
import { orsdv } from './ors-dv';
import { findActiveActivityDetailByUser } from './repo';
import { formatName } from './utils';

type Document = {
  filename: string;
  doc: Uint8Array;
};

type ExcelTextNode = {
  '#text': string;
};

type ExcelInlineStr = {
  t: ExcelTextNode;
};

type ExcelCell = {
  '@_r': string; // Cell reference (e.g., "E7")
  '@_t'?: 'inlineStr'; // Type attribute ('inlineStr' for text, omitted for raw numbers)
  v?: string; // Numeric or raw values
  is?: ExcelInlineStr; // Inline string structural object
};

type ExcelRow = {
  '@_r': string; // Row index string (e.g., "7")
  c: ExcelCell[]; // Array of cells
};

type ExcelSheetData = {
  row: ExcelRow[];
};

type ExcelWorksheet = {
  sheetData: ExcelSheetData;
  [key: string]: unknown; // Captures other sheet properties like pageMargins, dimension, etc.
};

type ExcelWorksheetRoot = {
  worksheet: ExcelWorksheet;
};

// Types for the Workbook Mapping Structure
type ExcelWorkbookSheetAttr = {
  '@_name': string;
  '@_r:id': string;
  [key: string]: unknown;
};

type ExcelWorkbookRoot = {
  workbook?: {
    sheets?: {
      sheet?: ExcelWorkbookSheetAttr | ExcelWorkbookSheetAttr[];
    };
  };
};

type ExcelRelationshipAttr = {
  '@_Id': string;
  '@_Target': string;
  [key: string]: unknown;
};

type ExcelRelsRoot = {
  Relationships?: {
    Relationship?: ExcelRelationshipAttr | ExcelRelationshipAttr[];
  };
};

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

async function genORSDoc(
  activity: ActivityDetail,
  honoraria: HonorariumDetail[]
): Promise<Document> {
  // 1. Dynamic imports for zip and XML manipulation
  const { ZipReader, ZipWriter, Uint8ArrayReader, Uint8ArrayWriter } =
    await import('@zip.js/zip.js');
  const { XMLParser } = await import('fast-xml-parser');
  const { default: XMLBuilder } = await import('fast-xml-builder');

  const templateBytes = Buffer.from(orsdv, 'base64');

  // 2. Initialize fast-xml-parser with specific configurations to preserve structures
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: false,
    textNodeName: '#text',
    isArray: name => ['row', 'c'].includes(name),
  });

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    format: false,
  });

  // 3. Extract and map zip entries
  const zipReader = new ZipReader(new Uint8ArrayReader(templateBytes));
  const entries = await zipReader.getEntries();

  // We will hold files in memory. Worksheets will be targeted by their file paths.
  // Generally, workbook target mappings determine this, but if your sheets are static:
  // Sheet 'ORS' -> usually 'xl/worksheets/sheet1.xml'
  // Sheet 'DV'  -> usually 'xl/worksheets/sheet2.xml'
  // If your template ordering changes, map them using xl/workbook.xml and xl/_rels/workbook.xml.rels
  const files: Record<string, Uint8Array> = {};

  for (const entry of entries) {
    if (!entry.directory && entry.getData)
      files[entry.filename] = await entry.getData(new Uint8ArrayWriter());
  }

  await zipReader.close();

  const orsPath = getSheetPathByName(parser, files, 'ORS');
  const dvPath = getSheetPathByName(parser, files, 'DV');

  // Parse worksheet contents
  const orsXml = new TextDecoder().decode(files[orsPath]);
  const dvXml = new TextDecoder().decode(files[dvPath]);

  const orsObj = parser.parse(orsXml);
  const dvObj = parser.parse(dvXml);

  // 5. Data Calculations
  const { title, venue, firstname, mi, lastname, startDate, endDate, code, location } = activity;
  let payee = formatName({ firstname, mi, lastname });
  const numPayees = honoraria.length;
  let other = 'OTHER';
  if (numPayees > 2) other += 'S';
  if (numPayees > 1) payee += ` AND ${(numPayees - 1).toString()} ${other}`;

  const dateRange = formatDateRange(startDate, endDate);
  const particulars = `To payment of honorarium as Resource Person during the ${title} held at ${venue}, ${location} on ${dateRange}`;
  const amount = honoraria.reduce((acc, payment) => acc + payment.amount, 0);
  const { mfoCode } = parseActivityCode(code);

  // 6. Execute Surgical Updates
  // ORS Sheet Modifications
  setCellValue(orsObj, 7, 5, payee); // Row 7, Col E
  setCellValue(orsObj, 16, 5, particulars); // Row 16, Col E
  setCellValue(orsObj, 16, 14, amount); // Row 16, Col N
  setCellValue(orsObj, 32, 5, code); // Row 32, Col E
  setCellValue(orsObj, 16, 11, mfoCode); // Row 16, Col K

  // DV Sheet Modifications
  setCellValue(dvObj, 11, 6, payee); // Row 11, Col F
  setCellValue(dvObj, 16, 2, particulars); // Row 16, Col B
  setCellValue(dvObj, 17, 29, amount); // Row 17, Col AC

  // 7. Serialize XML back to byte arrays
  files[orsPath] = new TextEncoder().encode(builder.build(orsObj));
  files[dvPath] = new TextEncoder().encode(builder.build(dvObj));

  // 8. Re-zip everything back up (this preserves vbaProject.bin automatically since it's unmodified in `files`)
  const zipWriter = new ZipWriter(new Uint8ArrayWriter());
  for (const [filename, data] of Object.entries(files)) {
    await zipWriter.add(filename, new Uint8ArrayReader(data));
  }

  const doc = await zipWriter.close();
  const filename = `ORS-${code}.xlsm`;

  return {
    doc,
    filename,
  };
}

// Helper utility to convert 1-indexed column to Excel column string (e.g., 1 -> A, 27 -> AA)
function getColName(col: number): string {
  let name = '';
  while (col > 0) {
    const temp = (col - 1) % 26;
    name = String.fromCodePoint(65 + temp) + name;
    col = Math.floor((col - temp) / 26);
  }
  return name;
}

// 4. Surgical injection function for raw sheet XML objects
function setCellValue(
  sheetObj: ExcelWorksheetRoot,
  rowNum: number,
  colNum: number,
  value: string | number
) {
  if (!sheetObj.worksheet) sheetObj.worksheet = { sheetData: { row: [] } };

  if (!sheetObj.worksheet.sheetData) sheetObj.worksheet.sheetData = { row: [] };

  if (!sheetObj.worksheet.sheetData.row) sheetObj.worksheet.sheetData.row = [];

  const rows = sheetObj.worksheet.sheetData.row;
  let row = rows.find(r => Number.parseInt(r['@_r'], 10) === rowNum);

  if (!row) {
    row = { '@_r': String(rowNum), c: [] };
    rows.push(row);
    rows.sort((a, b) => Number.parseInt(a['@_r'], 10) - Number.parseInt(b['@_r'], 10));
  }

  if (!row.c) row.c = [];

  const cellRef = `${getColName(colNum)}${rowNum}`;
  let cell = row.c.find(c => c['@_r'] === cellRef);

  if (!cell) {
    cell = { '@_r': cellRef };
    row.c.push(cell);
    row.c.sort((a, b) => a['@_r'].localeCompare(b['@_r']));
  }

  if (typeof value === 'number') {
    delete cell['@_t'];
    cell.v = String(value);
    delete cell.is;
  } else {
    cell['@_t'] = 'inlineStr';
    delete cell.v;
    cell.is = { t: { '#text': String(value) } };
  }
}

// Helper function to resolve dynamic sheet targets from sheet names
function getSheetPathByName(
  parser: XMLParser,
  files: Record<string, Uint8Array>,
  sheetName: string
): string {
  const workbookXml = new TextDecoder().decode(files['xl/workbook.xml']);
  const workbookObj = parser.parse(workbookXml) as ExcelWorkbookRoot;

  // Normalize sheets array
  const rawSheets = workbookObj?.workbook?.sheets?.sheet;
  const sheetsList = Array.isArray(rawSheets) ? rawSheets : [rawSheets].filter(Boolean);

  const targetSheet = sheetsList.find(s => s['@_name'] === sheetName);
  if (!targetSheet) throw new Error(`Workbook does not have a sheet named ${sheetName}.`);

  const rId = targetSheet['@_r:id'];

  // Find matching path in relationships
  const relsXml = new TextDecoder().decode(files['xl/_rels/workbook.xml.rels']);
  const relsObj = parser.parse(relsXml) as ExcelRelsRoot;
  const relsList = Array.isArray(relsObj?.Relationships?.Relationship)
    ? relsObj.Relationships.Relationship
    : [relsObj?.Relationships?.Relationship].filter(Boolean);

  const rel = relsList.find(r => r['@_Id'] === rId);
  if (!rel) throw new Error(`Relationship target missing for sheet: ${sheetName}`);

  // Resolve relative path (usually targets are like "worksheets/sheet1.xml")
  return `xl/${rel['@_Target']}`;
}
