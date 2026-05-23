import type { Client } from '@libsql/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { ActivityUpdate, NewActivity } from '@shared/schemas/activity';
import { createTestDB } from '../../../tests/helpers/db';
import { createActivity, updateActivity } from './repo';

describe('ActivityRepo', () => {
  let db: Client;

  beforeEach(async () => {
    db = await createTestDB();

    // Insert required test data for foreign key constraints
    await db.execute(
      "INSERT INTO users (id, google_id, name, email) VALUES (1, 'google1', 'Test User', 'test@example.com')"
    );

    await db.execute(
      "INSERT INTO positions (id, name, created_by, updated_by) VALUES (1, 'Test Position', 1, 1)"
    );

    await db.execute(
      "INSERT INTO focals (id, firstname, lastname, position_id, created_by, updated_by) VALUES (1, 'John', 'Doe', 1, 1, 1)"
    );

    await db.execute(
      "INSERT INTO venues (id, name, location, created_by, updated_by) VALUES (1, 'Test Venue', 'Test Location', 1, 1)"
    );
  });

  afterEach(() => {
    db.close();
  });

  describe('updateActivity', () => {
    const baseActivity: NewActivity = {
      title: 'Test Activity',
      venueId: 1,
      startDate: '2023-01-01',
      endDate: '2023-01-02',
      code: 'AC-01-TEST-ACTIVITY-CODE-001',
      fundSource: 'Test Fund',
      focalId: 1,
      createdBy: 1,
    };

    const updateData: ActivityUpdate = {
      title: 'Updated Activity',
      venueId: 1,
      code: 'AC-01-TEST-ACTIVITY-CODE-002',
      fundSource: 'Updated Fund',
      focalId: 1,
      startDate: '2023-02-01',
      endDate: '2023-02-02',
      updatedBy: 1,
    };

    it('should update an existing activity and return true', async () => {
      // Insert a test activity
      await createActivity(db, baseActivity);

      // Update the activity
      const result = await updateActivity(db, baseActivity.code, updateData);

      expect(result).toBe(true);

      // Verify the update in the database
      const { rows } = await db.execute('SELECT * FROM activities WHERE code = ?', [
        updateData.code,
      ]);

      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        title: updateData.title,
        venue_id: updateData.venueId,
        code: updateData.code,
        fund_source: updateData.fundSource,
        focal_id: updateData.focalId,
        start_date: updateData.startDate,
        end_date: updateData.endDate,
        updated_by: updateData.updatedBy,
      });
    });

    it('should return false when trying to update a non-existent activity', async () => {
      const result = await updateActivity(db, 'NON-EXISTENT-CODE', updateData);
      expect(result).toBe(false);
    });

    it('should return false when trying to update a deleted activity', async () => {
      // Insert a test activity
      await createActivity(db, baseActivity);

      // Mark it as deleted
      await db.execute('UPDATE activities SET deleted_at = ? WHERE code = ?', [
        new Date().toISOString(),
        baseActivity.code,
      ]);

      // Try to update the deleted activity
      const result = await updateActivity(db, baseActivity.code, updateData);
      expect(result).toBe(false);
    });
  });
});
