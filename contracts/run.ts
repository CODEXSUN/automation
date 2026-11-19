export type WorkerAuthorization = { tenantId: string; userId: string; sessionId: string };
export const queueLimits = { pending: 100, requesterPending: 8 } as const;
export type Variant = 'quick' | 'quality' | 'failure-probe';
export type StepKey = 'setup' | 'versions' | 'typecheck' | 'failure-probe';
export type JobState = 'pending' | 'running' | 'succeeded' | 'failed' | 'interrupted' | 'cancelled';
export type RunView = {
  creator: string; outcomeReason: string | null; review: string | null;
  publicId: string; variant: Variant; status: JobState; createdAt: string;
  startedAt: string | null; finishedAt: string | null;
  durationMs: number | null; queueWaitMs: number | null;
};
export type StepView = { key: StepKey; status: 'succeeded' | 'failed'; reason: string; durationMs: number; position: number };
export type RunDetail = RunView & { steps: StepView[]; reviews: { reviewer: string; decision: string; note: string; createdAt: string }[] };
export type QueueView = { capacity?: typeof queueLimits; worker?: { online: boolean; redisReady: boolean; lastSeen: string | null };  pending: number; running: number; succeeded: number; failed: number; interrupted: number; cancelled: number; latest: RunView | null };
