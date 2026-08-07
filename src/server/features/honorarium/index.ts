import logger from '@server/logger';
import type {
  HonorariumDetail,
  HonorariumDetailSafe,
} from '@shared/schemas/honorarium';

const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    logger.info(`${entry.name}: ${entry.duration} milliseconds`);
  });
});
obs.observe({ entryTypes: ['measure'] });

/**
 * Remove account number from a list of honoraria to produce a safe view.
 * Explicitly constructs the return object so we don't need eslint-disable comments.
 */
export function stripAccountNo(
  honoraria: HonorariumDetail[],
): HonorariumDetailSafe[] {
  return honoraria.map(({ accountNo: _, ...honorarium }) => honorarium);
}
