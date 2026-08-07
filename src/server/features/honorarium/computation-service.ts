import { db } from '@server/db';
import { decrypt } from '@server/security';
import { formatName } from '@server/utils';
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

  performance.mark('startPatch');
  const data = honoraria.map((honorarium) =>
    buildCompPatches(activityDetails, honorarium),
  );
  performance.mark('endPatch');
  performance.measure('Patches built', 'startPatch', 'endPatch');

  performance.mark('startBuildReport');
  const doc = await buildReport(compTemplate, { data });
  performance.mark('endBuildReport');
  performance.measure('Built report', 'startBuildReport', 'endBuildReport');

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
