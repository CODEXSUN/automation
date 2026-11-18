import { sql, type Kysely } from 'kysely';
export async function up(db: Kysely<any>) {
  await db.schema.alterTable('audit_runs').addColumn('authorization', 'jsonb').execute();
  await db.schema.alterTable('audit_runs').addColumn('outcome_reason', 'text').execute();
  await db.schema.createTable('audit_worker').addColumn('singleton', 'integer', c => c.primaryKey())
    .addColumn('seen_at', 'timestamptz', c => c.notNull()).addColumn('redis_ready', 'boolean', c => c.notNull())
    .addCheckConstraint('audit_worker_singleton', sql`singleton=1`).execute();
  await db.schema.createTable('audit_reviews').addColumn('id', 'integer', c => c.generatedAlwaysAsIdentity().primaryKey())
    .addColumn('run_id', 'integer', c => c.notNull().references('audit_runs.id'))
    .addColumn('reviewer', 'text', c => c.notNull()).addColumn('decision', 'text', c => c.notNull())
    .addColumn('note', 'text', c => c.notNull()).addColumn('created_at', 'timestamptz', c => c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addCheckConstraint('audit_review_decision', sql`decision in ('accepted','needs-attention')`).execute();
}
export async function down(db: Kysely<any>) { await db.schema.dropTable('audit_reviews').execute(); await db.schema.dropTable('audit_worker').execute(); await db.schema.alterTable('audit_runs').dropColumn('authorization').execute(); await db.schema.alterTable('audit_runs').dropColumn('outcome_reason').execute(); }
