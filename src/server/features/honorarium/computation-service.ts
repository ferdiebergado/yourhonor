import { db } from '@server/db';
import { decrypt } from '@server/security';
import { formatName, logPerfTime } from '@server/utils';
import type { ActivityDetail } from '@shared/schemas/activity';
import type { HonorariumDetail } from '@shared/schemas/honorarium';
import { formatAmount, formatDateRange, getMaxSalary } from '@shared/utils';
import { findActiveActivityDetailByUser } from '../activity/repo';
import type { Document } from '../types';
import { buildReport } from '../utils';
import { computation } from './computation';
import { findActiveHonorariaWithAccountByActivity, recordUsage } from './repo';

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

const compTemplate = Buffer.from(computation, 'base64');

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

  let accountNumber = '';
  try {
    accountNumber = decrypt(Buffer.from(honorarium.accountNo || '')).toString();
  } catch {
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
  const filename = `computation-${code}-${Date.now()}.docx`;

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

  const patchStart = performance.now();
  const data = honoraria.map((honorarium) =>
    buildCompPatches(activityDetails, honorarium),
  );
  logPerfTime('Build Patches', patchStart);

  const buildStart = performance.now();
  const doc = await buildReport(compTemplate, { data });
  logPerfTime('Build Report', buildStart);

  return { doc, filename };
}

export async function generateComputation(
  activityCode: string,
  userId: number,
): Promise<Document | undefined> {
  const queryStart = performance.now();
  const activity = await findActiveActivityDetailByUser(
    db,
    activityCode,
    userId,
  );
  logPerfTime('Activity Query', queryStart);

  if (!activity) return;

  const honorariaQueryStart = performance.now();
  const honoraria = await findActiveHonorariaWithAccountByActivity(
    db,
    activityCode,
    userId,
  );
  logPerfTime('Honoraria Query', honorariaQueryStart);

  if (!honoraria || honoraria.length === 0) return;

  const doc = await genCompDoc(activity, honoraria);
  const recordUsageStart = performance.now();
  await recordUsage(db, 'Computation', userId);
  logPerfTime('Record Usage', recordUsageStart);

  return doc;
}
