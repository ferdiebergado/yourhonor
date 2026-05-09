import type { Client } from '@libsql/client';
import { snakeToCamel } from '@shared/utils';
import type { CamelCasedProperties } from 'type-fest';

type SummaryRow = {
  total_activities: number;
  total_honoraria: number;
};

export async function getSummary(
  db: Client
): Promise<CamelCasedProperties<SummaryRow> | undefined> {
  const sql = `
SELECT
  COUNT(DISTINCT activity_code) AS total_activities,
  COUNT(id) AS total_honoraria
FROM honoraria;
  `;

  const { rows } = await db.execute(sql);

  return snakeToCamel(rows[0] as unknown as SummaryRow);
}
