import { randomInt } from 'node:crypto';
import { sql, type Kysely, type Selectable } from 'kysely';
import type { AuditDatabase } from './database/types.ts';
import type { RunView, RunDetail, QueueView, Variant, StepView } from '../../../../../contracts/run.ts';

export const localScope = { tenant: 'local-operator', actor: 'automation-local-operator' } as const;
type Db = Kysely<AuditDatabase>;
type Row = Selectable<AuditDatabase['audit_runs']>;
const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const publicId = () => Array.from({ length: 8 }, () => alphabet[randomInt(alphabet.length)]).join('');
function view(row: NonNullable<Row>): RunView {
  return { publicId: row.public_id, variant: row.variant, status: row.status, createdAt: row.created_at.toISOString(),
    startedAt: row.started_at?.toISOString() ?? null, finishedAt: row.finished_at?.toISOString() ?? null,
    durationMs: row.duration_ms, queueWaitMs: row.queue_wait_ms };
}
export function repository(db: Db) {
  const raw = (id: string) => db.selectFrom('audit_runs').selectAll().where('public_id', '=', id).where('tenant_id', '=', localScope.tenant).executeTakeFirst();
  return {
    raw,
    async enqueue(variant: Variant, requestKey: string) {
      const previous = await db.selectFrom('audit_runs').selectAll().where('tenant_id', '=', localScope.tenant).where('request_key', '=', requestKey).executeTakeFirst();
      if (previous) {
        if (previous.variant !== variant) throw Object.assign(new Error('Request key already belongs to another variant.'), { statusCode: 409 });
        return view(previous);
      }
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const row = await db.insertInto('audit_runs').values({ public_id: publicId(), tenant_id: localScope.tenant, created_by: localScope.actor, updated_by: localScope.actor,
            variant, status: 'pending', request_key: requestKey, started_at: null, finished_at: null, lease_until: null, duration_ms: null, queue_wait_ms: null }).returningAll().executeTakeFirstOrThrow();
          return view(row);
        } catch (error) {
          const pgError = error as { code?: string; constraint?: string };
          if (pgError.code === '23505' && pgError.constraint === 'audit_runs_public_id_key') continue;
          if (pgError.code === '23505' && pgError.constraint === 'audit_runs_request_key') {
            const old = await db.selectFrom('audit_runs').selectAll().where('tenant_id', '=', localScope.tenant).where('request_key', '=', requestKey).executeTakeFirstOrThrow();
            if (old.variant !== variant) throw Object.assign(new Error('Request key already belongs to another variant.'), { statusCode: 409 });
            return view(old);
          }
          throw error;
        }
      }
      throw new Error('Unable to allocate a public job reference.');
    },
    async list() { return (await db.selectFrom('audit_runs').selectAll().where('tenant_id', '=', localScope.tenant).orderBy('id', 'desc').limit(100).execute()).map(view); },
    async detail(id: string): Promise<RunDetail | null> {
      const row = await raw(id); if (!row) return null;
      const steps = await db.selectFrom('audit_steps').selectAll().where('run_id', '=', row.id).orderBy('position').execute();
      return { ...view(row), steps: steps.map(step => ({ key: step.step_key, status: step.status, reason: step.reason, durationMs: step.duration_ms, position: step.position })) };
    },
    async queue(): Promise<QueueView> {
      const counts = await db.selectFrom('audit_runs').select(['status', db.fn.countAll<number>().as('count')]).where('tenant_id', '=', localScope.tenant).groupBy('status').execute();
      const result: QueueView = { pending: 0, running: 0, succeeded: 0, failed: 0, interrupted: 0, cancelled: 0, latest: (await this.list())[0] ?? null };
      for (const count of counts) result[count.status] = Number(count.count);
      return result;
    },
    async cancel(id: string) {
      return await db.updateTable('audit_runs').set({ status: 'cancelled', finished_at: new Date(), updated_at: new Date(), updated_by: localScope.actor })
        .where('tenant_id', '=', localScope.tenant).where('public_id', '=', id).where('status', '=', 'pending').returning('public_id').executeTakeFirst();
    },
    async claim() {
      return db.transaction().execute(async trx => {
        // Abandoned work is visible and never automatically repeated.
        await trx.updateTable('audit_runs').set({ status: 'interrupted', finished_at: new Date(), updated_at: new Date(), updated_by: localScope.actor, lease_until: null })
          .where('tenant_id', '=', localScope.tenant).where('status', '=', 'running').where('lease_until', '<', new Date()).execute();
        // One active audit per operator: serialize short claim transactions with an advisory lock.
        await sql`select pg_advisory_xact_lock(19381721)`.execute(trx);
        const active = await trx.selectFrom('audit_runs').select('id').where('tenant_id', '=', localScope.tenant).where('status', '=', 'running').executeTakeFirst();
        if (active) return null;
        const row = await trx.selectFrom('audit_runs').selectAll().where('tenant_id', '=', localScope.tenant).where('status', '=', 'pending').orderBy('id').forUpdate().skipLocked().executeTakeFirst();
        if (!row) return null;
        const now = new Date();
        return await trx.updateTable('audit_runs').set({ status: 'running', started_at: now, lease_until: new Date(now.getTime() + 300000), queue_wait_ms: Math.max(0, now.getTime() - row.created_at.getTime()), updated_at: now, updated_by: localScope.actor }).where('id', '=', row.id).returningAll().executeTakeFirstOrThrow();
      });
    },
    async saveStep(id: number, step: StepView) {
      // Runs have one immutable execution attempt; no automatic retry overwrites step evidence.
      const row = await db.selectFrom('audit_runs').select('status').where('id', '=', id).where('tenant_id', '=', localScope.tenant).executeTakeFirstOrThrow();
      if (row.status !== 'running') throw new Error('Run no longer owns execution.');
      await db.insertInto('audit_steps').values({ run_id: id, position: step.position, step_key: step.key, status: step.status, reason: step.reason, duration_ms: step.durationMs }).execute();
    },
    async finish(id: number, success: boolean, durationMs: number) {
      const result = await db.updateTable('audit_runs').set({ status: success ? 'succeeded' : 'failed', duration_ms: durationMs, finished_at: new Date(), lease_until: null, updated_at: new Date(), updated_by: localScope.actor })
        .where('id', '=', id).where('tenant_id', '=', localScope.tenant).where('status', '=', 'running').returning('id').executeTakeFirst();
      if (!result) throw new Error('Run completion could not be persisted.');
    },
  };
}
