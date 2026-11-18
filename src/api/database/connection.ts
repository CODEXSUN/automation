import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import { appRoot } from '../../../scripts/preflight.ts';
import { loadEnvFile } from 'node:process';
import path from 'node:path';
import type { AuditDatabase } from '../modules/business/audit-run/database/types.ts';
import {existsSync} from 'node:fs';
export function validDatabaseHost(url:URL,docker=process.env.CODESHIP_CONTAINER_MODE==='1'&&existsSync('/.dockerenv')){
  return ['127.0.0.1','localhost','[::1]'].includes(url.hostname)||docker&&url.hostname==='postgres'&&url.port==='5432'&&url.pathname==='/app_automation';
}

export function loadLocalEnvironment() {
  // Node respects already-present process settings. No environment values are printed.
  try { loadEnvFile(path.join(appRoot, '.env')); } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw new Error('Unable to load local environment.');
  }
}
export function connectDatabase(test = false) {
  loadLocalEnvironment();
  const connectionString = process.env[test ? 'AUTOMATION_TEST_DATABASE_URL' : 'AUTOMATION_DATABASE_URL'];
  if (!connectionString) throw new Error('Configure the Automation PostgreSQL connection privately.');
  const url = new URL(connectionString);
  if (!validDatabaseHost(url)) throw new Error('Job storage requires loopback or the isolated CodeShip database.');
  if (test && (process.env.NODE_ENV !== 'test' || !url.pathname.endsWith('_test'))) throw new Error('Database tests require NODE_ENV=test and a dedicated *_test database.');
  return new Kysely<AuditDatabase>({ dialect: new PostgresDialect({ pool: new pg.Pool({ connectionString, max: 4, connectionTimeoutMillis: 2000, statement_timeout: 5000, idleTimeoutMillis: 10000 }) }) });
}
