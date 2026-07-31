import { mergeDocx } from '@benedicte/docx-merge';
import { db } from '@server/db';
import { findActiveActivityDetailByUser } from '@server/features/activity/repo';
import logger from '@server/logger';
import { decrypt } from '@server/security';
import type { ActivityDetail } from '@shared/schemas/activity';
import type {
  HonorariumDetail,
  HonorariumDetailSafe,
} from '@shared/schemas/honorarium';
import {
  formatAmount,
  formatDate,
  formatDateRange,
  getFullName,
  getMaxSalary,
} from '@shared/utils';
import { formatVenue } from '../activity/utils';
import { certification } from './certification';
import { computation } from './computation';
import { findActiveHonorariaWithAccountByActivity, recordUsage } from './repo';
import { amountToWords, patchDoc } from './utils';

type Document = {
  filename: string;
  doc: Buffer;
};

// Shared types for activity details required by document builders
type ActivityDocDetails = Pick<
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
>;

type ComputationActivityDetails = Pick<
  ActivityDetail,
  | 'title'
  | 'venue'
  | 'firstname'
  | 'mi'
  | 'lastname'
  | 'startDate'
  | 'endDate'
  | 'position'
>;

const DOCX_EXT = '.docx';
const MAX_MERGE_BATCH = 50;

const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    logger.info(`${entry.name}: ${entry.duration} milliseconds`);
  });
});
obs.observe({ entryTypes: ['measure'] });

const amountWordsCache = new Map<number, string>();

async function amountToWordsMemo(amount: number): Promise<string> {
  const key = Number(amount);
  const cached = amountWordsCache.get(key);
  if (cached) return cached;
  const words = await amountToWords(amount);
  amountWordsCache.set(key, words);
  return words;
}

/**
 * Merge multiple DOCX documents into a single Buffer result.
 * Accepts Buffer or Uint8Array entries and normalizes to Buffer.
 * Throws an error if merging fails or no documents provided.
 */
async function mergeDocuments(
  docs: Array<Buffer | Uint8Array>,
): Promise<Buffer> {
  if (!docs || docs.length === 0)
    throw new Error('No documents provided for merging.');

  if (docs.length === 1) return Buffer.from(docs[0]);

  if (docs.length > MAX_MERGE_BATCH) {
    throw new Error(
      `Refusing to merge ${docs.length} documents at once (limit ${MAX_MERGE_BATCH}).`,
    );
  }

  let mergedDoc: Buffer = Buffer.from(docs[0]);
  for (let i = 1; i < docs.length; i++) {
    const nextDoc = Buffer.from(docs[i]);
    const result = mergeDocx(mergedDoc, nextDoc, {
      insertEnd: true,
    });
    if (!result) throw new Error(`Failed to merge document at index ${i}.`);
    mergedDoc = result;
  }
  return mergedDoc;
}

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
  activity: ActivityDocDetails,
  honorarium: HonorariumDetail,
): Promise<CertificationPatches> => ({
  payee: formatName({
    firstname: honorarium.firstname,
    mi: honorarium.mi,
    lastname: honorarium.lastname,
  }),
  role: honorarium.role,
  activity: activity.title,
  venue: formatVenue(activity.venue, activity.location),
  end_date: formatDate(new Date()),
  amount: formatAmount(honorarium.amount),
  tax: honorarium.taxRate?.toString() ?? '',
  focal: formatName({
    firstname: activity.firstname,
    mi: activity.mi,
    lastname: activity.lastname,
  }),
  position: activity.position,
  date: formatDateRange(activity.startDate, activity.endDate),
  amount_words: await amountToWordsMemo(honorarium.amount),
});

/**
 * Generate a single certification DOCX by patching the certification template
 * for each honorarium and merging the results.
 *
 * @throws if honoraria is empty or merging fails
 */
export async function genCertDoc(
  activity: ActivityDetail,
  honoraria: HonorariumDetail[],
): Promise<Document> {
  if (!honoraria || honoraria.length === 0)
    throw new Error(
      'No honoraria provided for certification document generation.',
    );

  const { code } = activity;
  const filename = `certification-${code}-${Date.now()}${DOCX_EXT}`;

  const activityDetails: ActivityDocDetails = {
    title: activity.title,
    venue: activity.venue,
    location: activity.location,
    firstname: activity.firstname,
    mi: activity.mi,
    lastname: activity.lastname,
    position: activity.position,
    startDate: activity.startDate,
    endDate: activity.endDate,
  };

  performance.mark('startPatch');
  const patchedDocs = await Promise.all(
    honoraria.map(async (honorarium) => {
      const patches = await buildCertPatches(activityDetails, honorarium);
      return patchDoc(certification, patches);
    }),
  );
  performance.mark('endPatch');
  performance.measure('Patched docs', 'startPatch', 'endPatch');

  performance.mark('startMerge');
  const doc = await mergeDocuments(patchedDocs);
  performance.mark('endMerge');
  performance.measure('Merged docs', 'startMerge', 'endMerge');

  return { doc, filename };
}

export async function generateCertification(
  activityCode: string,
  userId: number,
): Promise<Document | undefined> {
  performance.mark('startActivityQuery');

  const activity = await findActiveActivityDetailByUser(
    db,
    activityCode,
    userId,
  );
  performance.mark('endActivityQuery');
  performance.measure(
    'findActiveActivityDetailByUser query',
    'startActivityQuery',
    'endActivityQuery',
  );

  if (!activity) return;

  performance.mark('startHonorariaQuery');
  const honoraria = await findActiveHonorariaWithAccountByActivity(
    db,
    activityCode,
    userId,
  );
  performance.mark('endHonorariaQuery');
  performance.measure(
    'findActiveHonorariaWithAccountByActivity query',
    'startHonorariaQuery',
    'endHonorariaQuery',
  );
  if (!honoraria || honoraria.length === 0) return;

  const doc = await genCertDoc(activity, honoraria);
  performance.mark('startRecord');
  await recordUsage(db, 'Certification', userId);
  performance.mark('endRecord');
  performance.measure('Usage recorded', 'startRecord', 'endRecord');

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
  activity: ComputationActivityDetails,
  honorarium: HonorariumDetail,
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

  // decrypt account number safely (don't let a decryption failure crash the whole doc generation)
  let accountNumber = '';
  try {
    accountNumber = decrypt(Buffer.from(honorarium.accountNo || '')).toString();
  } catch {
    // fallback to masked account if decryption fails
    accountNumber = honorarium.accountNoMasked ?? '';
  }

  const tags: ComputationPatches = {
    payee,
    focal,
    honorarium: formatAmount(honorarium.amount),
    date: formatDateRange(activity.startDate, activity.endDate),
    bank_branch: honorarium.bankBranch ?? '',
    account_name: honorarium.accountName ?? '',
    account_no: accountNumber,
    actual_honorarium: formatAmount(honorarium.actual),
    net_honorarium: formatAmount(honorarium.net),
    salary: formatAmount(salary),
    hours: (honorarium.hoursRendered ?? 0).toString(),
    role: honorarium.role,
    activity: activity.title,
    bank: honorarium.bank ?? '',
    tin: honorarium.tin ?? '',
    position: activity.position,
  };

  return tags;
}

/**
 * Generate a single computation DOCX by patching the computation template
 * for each honorarium and merging the results.
 *
 * @throws if honoraria is empty or merging fails
 */
export async function genCompDoc(
  activity: ActivityDetail,
  honoraria: HonorariumDetail[],
): Promise<Document> {
  if (!honoraria || honoraria.length === 0) {
    throw new Error(
      'No honoraria provided for computation document generation.',
    );
  }

  const { code } = activity;
  const filename = `computation-${code}-${Date.now()}${DOCX_EXT}`;

  const activityDetails: ComputationActivityDetails = {
    title: activity.title,
    venue: activity.venue,
    firstname: activity.firstname,
    mi: activity.mi,
    lastname: activity.lastname,
    position: activity.position,
    startDate: activity.startDate,
    endDate: activity.endDate,
  };

  performance.mark('startPatch');
  const patchedDocs = await Promise.all(
    honoraria.map(async (honorarium) => {
      const patches = buildCompPatches(activityDetails, honorarium);
      return patchDoc(computation, patches);
    }),
  );
  performance.mark('endPatch');
  performance.measure('Patched docs', 'startPatch', 'endPatch');

  performance.mark('startMerge');
  const doc = await mergeDocuments(patchedDocs);
  performance.mark('endMerge');
  performance.measure('Merged docs', 'startMerge', 'endMerge');

  return { doc, filename };
}

export async function generateComputation(
  activityCode: string,
  userId: number,
): Promise<Document | undefined> {
  performance.mark('startActivityCompQuery');

  const activity = await findActiveActivityDetailByUser(
    db,
    activityCode,
    userId,
  );
  performance.mark('endActivityCompQuery');
  performance.measure(
    'findActiveActivityDetailByUser query',
    'startActivityCompQuery',
    'endActivityCompQuery',
  );

  if (!activity) return;

  performance.mark('startHonorariaCompQuery');
  const honoraria = await findActiveHonorariaWithAccountByActivity(
    db,
    activityCode,
    userId,
  );
  performance.mark('endHonorariaCompQuery');
  performance.measure(
    'findActiveHonorariaWithAccountByActivity query',
    'startHonorariaCompQuery',
    'endHonorariaCompQuery',
  );

  if (!honoraria || honoraria.length === 0) return;

  const doc = await genCompDoc(activity, honoraria);
  performance.mark('startRecord');
  await recordUsage(db, 'Computation', userId);
  performance.mark('endRecord');
  performance.measure('Usage recorded', 'startRecord', 'endRecord');

  return doc;
}

/**
 * Remove account number from a list of honoraria to produce a safe view.
 * Explicitly constructs the return object so we don't need eslint-disable comments.
 */
export const stripAccountNo = (
  honoraria: HonorariumDetail[],
): HonorariumDetailSafe[] =>
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
