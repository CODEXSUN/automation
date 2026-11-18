export type Variant = 'quick' | 'quality' | 'failure-probe';
export type StepKey = 'setup' | 'versions' | 'typecheck' | 'failure-probe';
export type JobState = 'pending' | 'running' | 'succeeded' | 'failed' | 'interrupted' | 'cancelled';
export type RunView = {
  publicId: string; variant: Variant; status: JobState; createdAt: string;
  startedAt: string | null; finishedAt: string | null;
  durationMs: number | null; queueWaitMs: number | null;
};
export type StepView = { key: StepKey; status: 'succeeded' | 'failed'; reason: string; durationMs: number; position: number };
export type RunDetail = RunView & { steps: StepView[] };
export type QueueView = { pending: number; running: number; succeeded: number; failed: number; interrupted: number; cancelled: number; latest: RunView | null };
