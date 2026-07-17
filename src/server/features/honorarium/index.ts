import { db } from '@server/db';
import { findActiveActivityDetailByUser } from '@server/features/activity/repo';
import { decrypt } from '@server/security';
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
import { findActiveHonorariaWithAccountByActivity, recordUsage } from './repo';
import { amountToWords, patchDoc } from './utils';

type Document = {
  filename: string;
  doc: Uint8Array;
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
  'title' | 'venue' | 'firstname' | 'mi' | 'lastname' | 'startDate' | 'endDate' | 'position'
>;

// Helper function to merge multiple DOCX documents
async function mergeDocuments(docs: Buffer[]): Promise<Uint8Array> {
  if (docs.length === 0) throw new Error('No documents provided for merging.');

  if (docs.length === 1) return docs[0];

  const { mergeDocx } = await import('@benedicte/docx-merge');
  let mergedDoc = docs[0];
  for (let i = 1; i < docs.length; i++) {
    const result = mergeDocx(Buffer.from(mergedDoc), docs[i], { insertEnd: true });
    if (!result) throw new Error(`Failed to merge document at index ${i.toString()}.`);

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
  honorarium: HonorariumDetail
): Promise<CertificationPatches> => ({
  payee: formatName({
    firstname: honorarium.firstname,
    mi: honorarium.mi,
    lastname: honorarium.lastname,
  }),
  role: honorarium.role,
  activity: activity.title,
  venue: activity.location.toLocaleLowerCase() === 'online' ? 'online' : `at ${activity.venue}, ${activity.location}`,
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
  if (honoraria.length === 0)
    throw new Error('No honoraria provided for certification document generation.');

  const { code } = activity;
  const filename = 'certification-' + code;

  // Extract activity details using the shared type
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

  // Generate all patched documents in parallel
  const patchedDocPromises = honoraria.map(honorarium =>
    buildCertPatches(activityDetails, honorarium).then(patches => patchDoc(certification, patches))
  );

  const patchedDocs = await Promise.all(patchedDocPromises);

  // Merge all documents using the helper
  const doc = await mergeDocuments(patchedDocs);

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
  activity: ComputationActivityDetails,
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
  if (honoraria.length === 0)
    throw new Error('No honoraria provided for computation document generation.');

  const { code } = activity;
  const filename = 'computation-' + code;

  // Extract activity details using the shared type
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

  // Generate all patched documents in parallel
  const patchedDocPromises = honoraria.map(async honorarium => {
    const patches = buildCompPatches(activityDetails, honorarium);
    return await patchDoc(computation, patches);
  });

  const patchedDocs = await Promise.all(patchedDocPromises);

  // Merge all documents using the helper
  const doc = await mergeDocuments(patchedDocs);

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
