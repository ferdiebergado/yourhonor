import type { Client } from '@libsql/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { HonorariumUpdate, NewHonorarium } from '@shared/schemas/honorarium';
import { createTestDB } from '../../tests/helpers/db';
import { createHonorarium, updateHonorarium } from './repo';

describe('HonorariumRepo', () => {
  let db: Client;

  beforeEach(async () => {
    db = await createTestDB();

    // Insert required test data for foreign key constraints
    await db.execute(
      "INSERT INTO users (id, google_id, name, email) VALUES (1, 'google1', 'Test User', 'test@example.com'), (2, 'google2', 'Another User', 'another@example.com')"
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

    await db.execute(
      "INSERT INTO activities (id, title, venue_id, start_date, end_date, code, fund_source, focal_id, created_by, updated_by) VALUES (1, 'Test Activity', 1, '2023-01-01', '2023-01-02', 'AC-01-TEST-ACTIVITY-CODE-001', 'Test Fund', 1, 1, 1)"
    );

    await db.execute(
      "INSERT INTO payees (id, firstname, lastname, created_by, updated_by) VALUES (1, 'Jane', 'Smith', 1, 1)"
    );

    await db.execute(
      "INSERT INTO banks (id, name, created_by, updated_by) VALUES (1, 'Test Bank', 1, 1)"
    );

    await db.execute(
      "INSERT INTO accounts (payee_id, bank_id, details, created_by, updated_by) VALUES (1, 1, X'7b226163636f756e744e756d626572223a2231323334353637383930227d', 1, 1)"
    );

    await db.execute(
      "INSERT INTO roles (id, name, created_by, updated_by) VALUES (1, 'Test Role', 1, 1)"
    );
  });

  afterEach(() => {
    db.close();
  });

  describe('updateHonorarium', () => {
    let baseHonorarium: NewHonorarium;
    let updateData: HonorariumUpdate;

    beforeEach(async () => {
      // Get the auto-generated account ID for use in tests
      const { rows: accountRows } = await db.execute('SELECT id FROM accounts LIMIT 1');
      console.log('Account rows:', accountRows);
      const accountId = accountRows[0]['id'] as number;
      console.log('Account ID:', accountId);

      baseHonorarium = {
        activityCode: 'AC-01-TEST-ACTIVITY-CODE-001',
        payeeId: 1,
        roleId: 1,
        salary: 50_000,
        amount: 10_000,
        taxRate: 0.1,
        hoursRendered: 40,
        actual: 9000,
        net: 8100,
        accountId: accountId,
        createdBy: 1,
      };

      updateData = {
        activityCode: 'AC-01-TEST-ACTIVITY-CODE-001',
        payeeId: 1,
        roleId: 1,
        salary: 55_000,
        amount: 11_000,
        taxRate: 0.12,
        hoursRendered: 42,
        actual: 9800,
        net: 8624,
        accountId: accountId,
        updatedBy: 1,
      };

      console.log('Base honorarium:', baseHonorarium);
      console.log('Update data:', updateData);
    });

    it('should update an existing honorarium and return true', async () => {
      // Insert a test honorarium
      await createHonorarium(db, baseHonorarium);

      // Get the inserted honorarium ID
      const { rows } = await db.execute('SELECT id FROM honoraria WHERE activity_code = ?', [
        baseHonorarium.activityCode,
      ]);
      const id = rows[0].id as number;

      // Update the honorarium
      const result = await updateHonorarium(db, id, updateData);

      expect(result).toBe(true);

      // Verify the update in the database
      const { rows: updatedRows } = await db.execute('SELECT * FROM honoraria WHERE id = ?', [id]);

      expect(updatedRows).toHaveLength(1);
      expect(updatedRows[0]).toMatchObject({
        activity_code: updateData.activityCode,
        payee_id: updateData.payeeId,
        role_id: updateData.roleId,
        salary: updateData.salary,
        amount: updateData.amount,
        tax_rate: updateData.taxRate,
        hours_rendered: updateData.hoursRendered,
        actual: updateData.actual,
        net: updateData.net,
        account_id: updateData.accountId,
        updated_by: updateData.updatedBy,
      });
    });

    it('should return false when trying to update a non-existent honorarium', async () => {
      const result = await updateHonorarium(db, 99_999, updateData);
      expect(result).toBe(false);
    });

    it('should return false when trying to update a deleted honorarium', async () => {
      // Insert a test honorarium
      await createHonorarium(db, baseHonorarium);

      // Get the inserted honorarium ID
      const { rows } = await db.execute('SELECT id FROM honoraria WHERE activity_code = ?', [
        baseHonorarium.activityCode,
      ]);
      const id = rows[0].id as number;

      // Mark it as deleted
      await db.execute('UPDATE honoraria SET deleted_at = ? WHERE id = ?', [
        new Date().toISOString(),
        id,
      ]);

      // Try to update the deleted honorarium
      const result = await updateHonorarium(db, id, updateData);
      expect(result).toBe(false);
    });

    it('should return false when trying to update an honorarium created by a different user', async () => {
      // Insert a test honorarium created by user 1
      await createHonorarium(db, baseHonorarium);

      // Get the inserted honorarium ID
      const { rows } = await db.execute('SELECT id FROM honoraria WHERE activity_code = ?', [
        baseHonorarium.activityCode,
      ]);
      const id = rows[0].id as number;

      // Try to update it as user 2
      const updateAsDifferentUser: HonorariumUpdate = {
        ...updateData,
        updatedBy: 2, // Different user
      };

      const result = await updateHonorarium(db, id, updateAsDifferentUser);
      expect(result).toBe(false);
    });
  });
});
