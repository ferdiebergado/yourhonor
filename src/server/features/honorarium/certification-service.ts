import { db } from '@server/db';
import { logPerfTime } from '@server/utils';
import type { ActivityDetail } from '@shared/schemas/activity';
import type { HonorariumDetail } from '@shared/schemas/honorarium';
import { formatAmount, formatDate, formatDateRange } from '@shared/utils';
import { ToWords } from 'to-words';
import { findActiveActivityDetailByUser } from '../activity/repo';
import type { ActivityDocDetails, Document } from '../types';
import { buildReport, formatName, formatVenue } from '../utils';
import { certification } from './certification';
import { findActiveHonorariaWithAccountByActivity, recordUsage } from './repo';

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

const certTemplate = Buffer.from(certification, 'base64');
const amountWordsCache = new Map<number, string>();
const wordConverter = new ToWords({ localeCode: 'en-PH' });

async function amountToWords(amount: number): Promise<string> {
  return wordConverter.convert(amount, {
    currency: true,
    doNotAddOnly: true,
  });
}

async function amountToWordsMemo(amount: number): Promise<string> {
  const key = Number(amount);
  const cached = amountWordsCache.get(key);
  if (cached) return cached;
  const words = await amountToWords(amount);
  amountWordsCache.set(key, words);
  return words;
}

async function buildCertPatches(
  activity: ActivityDocDetails,
  honorarium: HonorariumDetail,
): Promise<CertificationPatches> {
  return {
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
  } satisfies CertificationPatches;
}

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
  const filename = `certification-${code}-${Date.now()}.docx`;

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

  const patchStart = performance.now();
  const data = await Promise.all(
    honoraria.map(
      async (honorarium) => await buildCertPatches(activityDetails, honorarium),
    ),
  );
  logPerfTime('Build Patches', patchStart);

  const buildStart = performance.now();
  const doc = await buildReport(certTemplate, { data });
  logPerfTime('Build Report', buildStart);

  return { doc, filename };
}

export async function generateCertification(
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

  const doc = await genCertDoc(activity, honoraria);
  const recordUsageStart = performance.now();
  await recordUsage(db, 'Certification', userId);
  logPerfTime('Record Usage', recordUsageStart);

  return doc;
}
