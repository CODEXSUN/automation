import {workerAuthorizer} from './authorization.ts';
import { executeNodeScript } from '@workspace/execution';
import path from 'node:path';
import { realpathSync } from 'node:fs';
import type { Kysely } from 'kysely';
import { appRoot } from '../../../../../scripts/preflight.ts';
import { repository, localScope } from './repository.ts';
import type { AuditDatabase } from './database/types.ts';
import type { Variant, StepKey } from '../../../../../contracts/run.ts';

export const variants: Record<Variant, { label: string; description: string; steps: StepKey[] }> = {
  quick: { label: 'Quick audit', description: 'Setup and package/changelog version consistency.', steps: ['setup', 'versions'] },
  quality: { label: 'Quality audit', description: 'Setup, version consistency and TypeScript checks.', steps: ['setup', 'versions', 'typecheck'] },
  'failure-probe': { label: 'Failure probe', description: 'Intentionally exits nonzero to verify red status and history.', steps: ['failure-probe'] },
};
export function parseVariant(value: unknown): Variant {
  if (typeof value !== 'string' || !Object.hasOwn(variants, value)) throw Object.assign(new Error('Choose a registered audit variant.'), { statusCode: 400 });
  return value as Variant;
}
export async function workOnce(db: Kysely<AuditDatabase>, reference?: string, authorize = workerAuthorizer(process.env)) {
  const repo = repository(db), run = await repo.claim(reference);
  if (!run) return null;
  // Reauthorization uses fixed local ownership; client payloads cannot grant scope or select commands.
  if (run.tenant_id !== localScope.tenant || !run.active) { await repo.finish(run.id,false,0,'scope-denied'); return repo.detail(run.public_id); }
  const steps = variants[parseVariant(run.variant)].steps;
  const scripts: Record<StepKey, { path: string; args: string[] }> = {
    setup: { path: 'scripts/setup-audit.mjs', args: [] },
    versions: { path: 'tools/check-versions.mjs', args: [] },
    typecheck: { path: 'node_modules/typescript/bin/tsc', args: ['-p', 'tsconfig.json'] },
    'failure-probe': { path: 'scripts/failure-probe.mjs', args: [] },
  };
  let success = true;
  const start = performance.now();
  for (const [position, key] of steps.entries()) {
    let allowed=false;try{allowed=await authorize(run.created_by,run.authorization);}catch{}
    if(!allowed){await repo.finish(run.id,false,Math.round(performance.now()-start),'authorization-denied');return repo.detail(run.public_id);}
    const script = scripts[key];
    const scriptPath = realpathSync(path.join(appRoot, script.path));
    const relative = path.relative(realpathSync(appRoot), scriptPath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Script escaped the owning repository.');
    const result = await executeNodeScript({ script: scriptPath, args: script.args, cwd: appRoot, timeoutMs: 30000,
      env: { SystemRoot: process.env.SystemRoot, WINDIR: process.env.WINDIR, TEMP: process.env.TEMP, TMP: process.env.TMP,
        AUTOMATION_GOVERNANCE_PATH: process.env.AUTOMATION_GOVERNANCE_PATH } });
    await repo.saveStep(run.id, { key, position, status: result.success ? 'succeeded' : 'failed', reason: result.reason, durationMs: result.durationMs });
    if (!result.success) { success = false; break; }
  }
  await repo.finish(run.id, success, Math.round(performance.now() - start));
  return repo.detail(run.public_id);
}
