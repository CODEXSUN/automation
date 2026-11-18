import { sql, type Kysely } from 'kysely';
export async function up(db: Kysely<any>) {
  await db.schema.createTable('audit_runs')
    .addColumn('id', 'integer', c => c.generatedAlwaysAsIdentity().primaryKey())
    .addColumn('public_id', 'varchar(32)', c => c.notNull().unique())
    .addColumn('active', 'boolean', c => c.notNull().defaultTo(true))
    .addColumn('tenant_id', 'text', c => c.notNull())
    .addColumn('created_at', 'timestamptz', c => c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamptz', c => c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('created_by', 'text', c => c.notNull()).addColumn('updated_by', 'text', c => c.notNull())
    .addColumn('variant', 'text', c => c.notNull()).addColumn('status', 'text', c => c.notNull().defaultTo('pending'))
    .addColumn('request_key', 'text', c => c.notNull())
    .addColumn('started_at', 'timestamptz').addColumn('finished_at', 'timestamptz').addColumn('lease_until', 'timestamptz')
    .addColumn('duration_ms', 'integer').addColumn('queue_wait_ms', 'integer')
    .addUniqueConstraint('audit_runs_request_key', ['tenant_id', 'request_key'])
    .addCheckConstraint('audit_runs_public_id', sql`public_id ~ '^[a-z0-9]{8}$'`)
    .addCheckConstraint('audit_runs_variant', sql`variant in ('quick','quality','failure-probe')`)
    .addCheckConstraint('audit_runs_status', sql`status in ('pending','running','succeeded','failed','interrupted','cancelled')`)
    .execute();
  await db.schema.createIndex('audit_runs_queue').on('audit_runs').columns(['status', 'created_at', 'id']).execute();
  await db.schema.createTable('audit_steps')
    .addColumn('run_id', 'integer', c => c.notNull().references('audit_runs.id'))
    .addColumn('position', 'integer', c => c.notNull())
    .addColumn('step_key', 'text', c => c.notNull()).addColumn('status', 'text', c => c.notNull())
    .addColumn('reason', 'text', c => c.notNull()).addColumn('duration_ms', 'integer', c => c.notNull())
    .addPrimaryKeyConstraint('audit_steps_key', ['run_id', 'position']).execute();
}
export async function down(db: Kysely<any>) {
  await db.schema.dropTable('audit_steps').execute();
  await db.schema.dropTable('audit_runs').execute();
}
