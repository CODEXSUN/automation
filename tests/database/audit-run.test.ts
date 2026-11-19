import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createHttpServer } from '@workspace/framework';
import { connectDatabase } from '../../src/api/database/connection.ts';
import { migrator } from '../../src/api/database/migrations.ts';
import { repository } from '../../src/api/modules/business/audit-run/repository.ts';
import { workOnce } from '../../src/api/modules/business/audit-run/service.ts';
import { registerRunRoutes } from '../../src/api/modules/business/audit-run/routes.ts';

test('real PostgreSQL queue: idempotency, serialization, green/red history, cancellation, recovery and API guards', {timeout:60000},async () => {
  const db = connectDatabase(true), repo = repository(db), created: string[] = [];
  const app = createHttpServer({ name: 'audit-test', logLevel: 'silent' });
  const key = () => `test-${randomUUID()}`;
  try {
    registerRunRoutes(app, db);await app.ready();
    const migration = await migrator(db).migrateToLatest(); assert.equal(migration.error, undefined);
    const requestKey = key();
    const duplicates = await Promise.all([repo.enqueue('quick', requestKey), repo.enqueue('quick', requestKey)]);
    created.push(duplicates[0].publicId);
    assert.equal(duplicates[0].publicId, duplicates[1].publicId);
    await assert.rejects(repo.enqueue('quality', requestKey));
    const passed = await workOnce(db);
    assert.equal(passed?.status, 'succeeded'); assert.equal(passed?.steps.length, 2);
    assert.ok(passed!.durationMs! >= 0); assert.ok(passed!.queueWaitMs! >= 0);
    const red = await repo.enqueue('failure-probe', key()); created.push(red.publicId);
    assert.equal((await workOnce(db))?.status, 'failed');
    assert.equal((await repo.detail(red.publicId))?.steps[0].reason, 'exit-nonzero');
    const cancel = await repo.enqueue('quick', key()); created.push(cancel.publicId);
    assert.ok(await repo.cancel(cancel.publicId)); assert.equal((await repo.detail(cancel.publicId))?.status, 'cancelled');
    const recover = await repo.enqueue('quick', key()); created.push(recover.publicId);
    const claims = await Promise.all([repo.claim(), repo.claim()]);
    assert.equal(claims.filter(Boolean).length, 1);
    await db.updateTable('audit_runs').set({ lease_until: new Date(0) }).where('public_id', '=', recover.publicId).execute();
    assert.deepEqual(await repo.pending(), []);
    assert.equal((await repo.detail(recover.publicId))?.status, 'interrupted');
    assert.equal((await repo.detail(recover.publicId))?.steps.length, 0);
    const headers = { host: '127.0.0.1:4395', origin: 'http://127.0.0.1:4395', 'idempotency-key': key() };
    const denied = await app.inject({ method: 'POST', url: '/api/v1/runs', remoteAddress: '192.0.2.1', headers, payload: { variant: 'quick' } });
    assert.equal(denied.statusCode, 403);
    for (const payload of [{ variant: 'arbitrary-shell' }, { variant: 'quick', command: 'anything' }]) {
      assert.equal((await app.inject({ method: 'POST', url: '/api/v1/runs', remoteAddress: '127.0.0.1', headers, payload })).statusCode, 400);
    }
    const response = await app.inject({ method: 'POST', url: '/api/v1/runs', remoteAddress: '127.0.0.1', headers, payload: { variant: 'quick' } });
    assert.equal(response.statusCode, 202); created.push(response.json().publicId);
    const replay = await app.inject({ method: 'POST', url: '/api/v1/runs', remoteAddress: '127.0.0.1', headers, payload: { variant: 'quick' } });
    assert.equal(response.json().publicId, replay.json().publicId);
  } finally {
    await app.close();
    if (created.length) {
      const rows = await db.selectFrom('audit_runs').select('id').where('public_id', 'in', created).execute();
      if (rows.length) await db.deleteFrom('audit_steps').where('run_id', 'in', rows.map(row => row.id)).execute();
      await db.deleteFrom('audit_runs').where('public_id', 'in', created).execute();
    }
    await db.destroy();
  }
});
