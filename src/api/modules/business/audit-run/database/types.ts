import type { Generated, ColumnType } from 'kysely';
import type { Variant, JobState, StepKey } from '../../../../../../contracts/run.ts';
type Timestamp = ColumnType<Date, Date | string | undefined, Date | string>;
export type AuditDatabase = {
  audit_runs: {
    id: Generated<number>; public_id: string; active: Generated<boolean>; tenant_id: string;
    created_at: Timestamp; updated_at: Timestamp; created_by: string; updated_by: string;
    variant: Variant; status: JobState; request_key: string;
    started_at: Date | null; finished_at: Date | null; lease_until: Date | null;
    duration_ms: number | null; queue_wait_ms: number | null;
  };
  audit_steps: {
    run_id: number; position: number; step_key: StepKey; status: 'succeeded' | 'failed';
    reason: string; duration_ms: number;
  };
};
