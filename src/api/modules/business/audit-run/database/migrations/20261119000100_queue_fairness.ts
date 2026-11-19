import type { Kysely } from 'kysely';
export async function up(db: Kysely<any>) {
  await db.schema.createIndex('audit_runs_requester_dispatch').on('audit_runs').columns(['tenant_id','created_by','started_at']).execute();
}
export async function down(db: Kysely<any>) {
  await db.schema.dropIndex('audit_runs_requester_dispatch').execute();
}
