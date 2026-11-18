import type { Kysely } from 'kysely';
import { Migrator } from 'kysely/migration';
import * as auditRuns from '../modules/business/audit-run/database/migrations/20261118000100_audit_runs.ts';

export function migrator(db: Kysely<any>) {
  return new Migrator({ db, provider: { getMigrations: async () => ({ '20261118000100_audit_runs': auditRuns }) } });
}
