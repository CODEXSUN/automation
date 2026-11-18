import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { auditSetup } from '../scripts/setup-audit.mjs';

test('prebuild audit passes installed setup and fails closed for unavailable governance', () => {
  const root = path.resolve(import.meta.dirname, '..');
  const previous = process.env.AUTOMATION_GOVERNANCE_PATH;
  try {
    process.env.AUTOMATION_GOVERNANCE_PATH = path.resolve(root, '../../mcp-governance/docs/governance.md');
    assert.equal(auditSetup(root).passed, true);
    process.env.AUTOMATION_GOVERNANCE_PATH = path.join(root, 'does-not-exist.md');
    const failed = auditSetup(root);
    assert.equal(failed.passed, false);
    assert.ok(failed.failures.some((failure: string) => failure.includes('Governance unavailable')));
  } finally {
    if (previous === undefined) delete process.env.AUTOMATION_GOVERNANCE_PATH;
    else process.env.AUTOMATION_GOVERNANCE_PATH = previous;
  }
});
