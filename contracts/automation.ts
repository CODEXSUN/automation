/** Operator tool catalog. IDs are catalog keys; durable audit jobs use contracts/run.ts. */
export type AutomationTool = {
  key: string;
  name: string;
  command: string;
  mode: 'deterministic';
  effect: 'read-only' | 'local-write' | 'external-write';
  availability: 'cli';
  description: string;
};
export type SetupStatus = {
  database: 'configured-unverified' | 'not-configured';
  redis: 'configured-unverified' | 'not-configured';
  aiRequired: false;
  execution: 'local-postgres';
};
export type DeskOverview = { tools: number; setup: SetupStatus; phase: 'local-audit-queue' };

/** Future persisted dispatch reference; no credentials, prompts or authority in payloads. */
export type DispatchReference = {
  schemaVersion: 1;
  runPublicId: string;
  stepPublicId: string;
  tenantId: string;
  correlationId: string;
};
export type AgentStep = {
  kind: 'agent';
  providerApp: 'zetro';
  /** Resolve against Zetro's versioned public capability contract at integration time. */
  capability: string;
  connectionReference: string;
};
export type DeterministicStep = { kind: 'tool'; toolKey: string };
export type AutomationStep = DeterministicStep | AgentStep;
export type RunStatus = 'pending' | 'waiting-for-queue' | 'running' | 'succeeded' | 'failed' | 'cancelled' | 'reconciliation-required';
