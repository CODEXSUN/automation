import type { Generated, ColumnType } from 'kysely';
import type { Variant, JobState, StepKey, WorkerAuthorization } from '../../../../../../contracts/run.ts';
type Timestamp = ColumnType<Date, Date | string | undefined, Date | string>;
export type AuditDatabase = {
  audit_runs: {
    authorization: WorkerAuthorization | null; outcome_reason: string | null;
    id: Generated<number>; public_id: string; active: Generated<boolean>; tenant_id: string;
    created_at: Timestamp; updated_at: Timestamp; created_by: string; updated_by: string;
    variant: Variant; status: JobState; request_key: string;
    started_at: Date | null; finished_at: Date | null; lease_until: Date | null;
    duration_ms: number | null; queue_wait_ms: number | null;
  };
  audit_worker: { singleton: number; seen_at: Date; redis_ready: boolean };
  audit_reviews: { id: Generated<number>; run_id: number; reviewer: string; decision: string; note: string; created_at: Generated<Date> };
  audit_steps: {
    run_id: number; position: number; step_key: StepKey; status: 'succeeded' | 'failed';
    reason: string; duration_ms: number;
  };
};
