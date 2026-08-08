import type { XMLParser } from 'fast-xml-parser';

import { db } from '@server/db';
import { formatName, logPerfTime } from '@server/utils';
import type { ActivityDetail } from '@shared/schemas/activity';
import type { HonorariumDetail } from '@shared/schemas/honorarium';
import { formatDateRange } from '@shared/utils';
import {
  findActiveHonorariaWithAccountByActivity,
  recordUsage,
} from '../honorarium/repo';
import { parseActivityCode } from '../honorarium/utils';
import type { Document } from '../types';
import { formatVenue } from '../utils';
import { ors } from './ors';
import { findActiveActivityDetailByUser } from './repo';

type TemplateFiles = Record<string, Uint8Array>;

let initPromise: Promise<void> | null = null;
let cachedTemplateFiles: TemplateFiles | null = null;
let cachedOrsPath: string | null = null;
let cachedDvPath: string | null = null;

let ZipReader: any;
let ZipWriter: any;
let Uint8ArrayReader: any;
let Uint8ArrayWriter: any;
let parser: XMLParser | null = null;
let builder: any = null;
let sharedTextEncoder: TextEncoder | null = null;
let sharedTextDecoder: TextDecoder | null = null;

async function ensureOrsTemplate() {
  if (!initPromise) {
    initPromise = (async () => {
      // Dynamic imports done once
      const zip = await import('@zip.js/zip.js');
      ZipReader = zip.ZipReader;
      ZipWriter = zip.ZipWriter;
      Uint8ArrayReader = zip.Uint8ArrayReader;
      Uint8ArrayWriter = zip.Uint8ArrayWriter;

      const { XMLParser } = await import('fast-xml-parser');
      const XMLBuilder = (await import('fast-xml-builder')).default;

      parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: false,
        textNodeName: '#text',
        isArray: (name: string) => ['row', 'c'].includes(name),
      });

      builder = new XMLBuilder({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        textNodeName: '#text',
        format: false,
      });

      sharedTextEncoder = new TextEncoder();
      sharedTextDecoder = new TextDecoder();

      // Read and cache template files once
      const templateBytes = Buffer.from(ors, 'base64');
      const zipReader = new ZipReader(new Uint8ArrayReader(templateBytes));
      const entries = await zipReader.getEntries();
      const files: TemplateFiles = {};
      for (const entry of entries) {
        if (!entry.directory)
          files[entry.filename] = await entry.getData(new Uint8ArrayWriter());
      }
      await zipReader.close();
      cachedTemplateFiles = files;

      // Resolve ORS/DV sheet paths from workbook.xml and workbook.xml.rels
      const workbookXml = sharedTextDecoder!.decode(
        cachedTemplateFiles['xl/workbook.xml'],
      );
      const workbookObj = parser.parse(workbookXml) as any;
      const rawSheets = workbookObj.workbook?.sheets?.sheet;
      const sheetsList = Array.isArray(rawSheets)
        ? rawSheets
        : [rawSheets].filter(Boolean);

      const targetORS = (sheetsList as any[]).find(
        (s) => s['@_name'] === 'ORS',
      );
      const targetDV = (sheetsList as any[]).find((s) => s['@_name'] === 'DV');
      if (!targetORS || !targetDV)
        throw new Error('Template missing ORS or DV sheets');

      const relsXml = sharedTextDecoder!.decode(
        cachedTemplateFiles['xl/_rels/workbook.xml.rels'],
      );
      const relsObj = parser.parse(relsXml) as any;
      const relsList = Array.isArray(relsObj.Relationships?.Relationship)
        ? relsObj.Relationships.Relationship
        : [relsObj.Relationships?.Relationship].filter(Boolean);

      const rIdORS = targetORS['@_r:id'];
      const rIdDV = targetDV['@_r:id'];
      const relORS = relsList.find((r: any) => r['@_Id'] === rIdORS);
      const relDV = relsList.find((r: any) => r['@_Id'] === rIdDV);
      if (!relORS || !relDV) throw new Error('Workbook rels missing ORS/DV');

      cachedOrsPath = `xl/${relORS['@_Target']}`;
      cachedDvPath = `xl/${relDV['@_Target']}`;
    })();
  }

  await initPromise;

  if (
    !cachedTemplateFiles ||
    !cachedOrsPath ||
    !cachedDvPath ||
    !parser ||
    !builder ||
    !sharedTextEncoder ||
    !sharedTextDecoder
  ) {
    throw new Error('Template initialization failed');
  }

  return {
    ZipReader,
    ZipWriter,
    Uint8ArrayReader,
    Uint8ArrayWriter,
    parser,
    builder,
    textEncoder: sharedTextEncoder,
    textDecoder: sharedTextDecoder,
    templateFiles: cachedTemplateFiles,
    orsPath: cachedOrsPath,
    dvPath: cachedDvPath,
  };
}

// Clone the cached template files for per-request mutation.
function cloneTemplateFiles(files: TemplateFiles): TemplateFiles {
  const copy: TemplateFiles = {};
  for (const [k, v] of Object.entries(files)) {
    copy[k] = v.slice();
  }
  return copy;
}

export async function generateORS(
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
  if (!honoraria || honoraria.length === 0) return;

  const doc = await genORSDoc(activity, honoraria);

  await recordUsage(db, 'ORS-DV', userId);

  return doc;
}

async function genORSDoc(
  activity: ActivityDetail,
  honoraria: HonorariumDetail[],
): Promise<Document> {
  const templateStart = performance.now();
  const ctx = await ensureOrsTemplate();
  logPerfTime('Template Initialization', templateStart);

  // Clone files so we never mutate the cached copy
  const cloneStart = performance.now();
  const files = cloneTemplateFiles(ctx.templateFiles);
  logPerfTime('Template Cloning', cloneStart);

  const orsPath = ctx.orsPath;
  const dvPath = ctx.dvPath;

  const orsXml = ctx.textDecoder.decode(files[orsPath]);
  const dvXml = ctx.textDecoder.decode(files[dvPath]);

  const orsObj = ctx.parser.parse(orsXml) as any;
  const dvObj = ctx.parser.parse(dvXml) as any;

  // Data Calculations
  const dataStart = performance.now();
  const { title, venue, startDate, endDate, code, location } = activity;
  const { firstname, mi, lastname } = honoraria[0];
  let payee = formatName({ firstname, mi, lastname });
  const numPayees = honoraria.length;
  let other = 'OTHER';
  if (numPayees > 2) other += 'S';
  if (numPayees > 1) payee += ` AND ${(numPayees - 1).toString()} ${other}`;

  const dateRange = formatDateRange(startDate, endDate);
  const formattedVenue = formatVenue(venue, location);
  const particulars = `To payment of honorarium as Resource Person during the ${title} held ${formattedVenue} on ${dateRange}`;
  const amount = honoraria.reduce((acc, payment) => acc + payment.amount, 0);
  const { mfoCode } = parseActivityCode(code);

  // Surgical updates using the same helper logic as before
  setCellValue(orsObj, 7, 5, payee); // Row 7, Col E
  setCellValue(orsObj, 16, 5, particulars); // Row 16, Col E
  setCellValue(orsObj, 16, 14, amount); // Row 16, Col N
  setCellValue(orsObj, 32, 5, code); // Row 32, Col E
  setCellValue(orsObj, 16, 11, mfoCode); // Row 16, Col K

  setCellValue(dvObj, 11, 6, payee); // Row 11, Col F
  setCellValue(dvObj, 16, 2, particulars); // Row 16, Col B
  setCellValue(dvObj, 17, 29, amount); // Row 17, Col AC
  logPerfTime('Data Calculations', dataStart);

  // Serialize modified worksheets back into files
  const serializeStart = performance.now();
  files[orsPath] = ctx.textEncoder.encode(ctx.builder.build(orsObj));
  files[dvPath] = ctx.textEncoder.encode(ctx.builder.build(dvObj));
  logPerfTime('Serialize Worksheets', serializeStart);

  // Re-zip files into a single document. Use the shared writer classes from ctx.
  const zipStart = performance.now();
  const zipWriter = new ctx.ZipWriter(new ctx.Uint8ArrayWriter());
  for (const [filename, data] of Object.entries(files)) {
    // Add expects a reader; we create a fresh reader for each entry
    await zipWriter.add(filename, new ctx.Uint8ArrayReader(data));
  }
  const doc = await zipWriter.close();
  logPerfTime('Zip Files', zipStart);
  const filename = `ORS-${code}.xlsm`;

  return { doc, filename };
}

function getColName(col: number): string {
  let name = '';
  while (col > 0) {
    const temp = (col - 1) % 26;
    name = String.fromCodePoint(65 + temp) + name;
    col = Math.floor((col - temp) / 26);
  }
  return name;
}

type ExcelWorksheetRoot = {
  worksheet?: {
    sheetData?: { row?: { '@_r': string; c?: any[] }[] };
    [key: string]: unknown;
  };
};

function setCellValue(
  sheetObj: ExcelWorksheetRoot,
  rowNum: number,
  colNum: number,
  value: string | number,
) {
  if (!sheetObj.worksheet) sheetObj.worksheet = { sheetData: { row: [] } };

  if (!sheetObj.worksheet.sheetData) sheetObj.worksheet.sheetData = { row: [] };

  if (!sheetObj.worksheet.sheetData.row) sheetObj.worksheet.sheetData.row = [];

  const rows = sheetObj.worksheet.sheetData.row as {
    '@_r': string;
    c?: any[];
  }[];
  let row = rows.find((r) => Number.parseInt(r['@_r'], 10) === rowNum);

  if (!row) {
    row = { '@_r': String(rowNum), c: [] };
    rows.push(row);
    rows.sort(
      (a, b) => Number.parseInt(a['@_r'], 10) - Number.parseInt(b['@_r'], 10),
    );
  }

  if (!row.c) row.c = [];

  const cellRef = `${getColName(colNum)}${String(rowNum)}`;
  let cell = row.c.find((c) => c['@_r'] === cellRef);

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
    cell.is = { t: { '#text': value } };
  }
}
