import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkVersions } from '../tools/check-versions.mjs';

export function auditSetup(root) {
  const failures = [];
  const required = ['AGENTS.md', 'contracts/automation.ts', 'src/api/server.ts',
    'node_modules/@workspace/framework/dist/src/index.js', 'node_modules/@workspace/ui/dist/src/index.js',
    'tools/github-helper.mjs', 'tools/version-bump.mjs'];
  for (const name of required) if (!existsSync(path.join(root, name))) failures.push(`Missing ${name}`);
  const governance = process.env.AUTOMATION_GOVERNANCE_PATH || path.resolve(root, '../../mcp-governance/docs/governance.md');
  if (!existsSync(governance)) failures.push('Governance unavailable; set AUTOMATION_GOVERNANCE_PATH for standalone development.');
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  for (const name of ['github:audit', 'version:preview', 'check:versions', 'prebuild']) {
    if (!pkg.scripts?.[name]) failures.push(`Missing script ${name}`);
  }
  failures.push(...checkVersions(root).failures);
  return { passed: failures.length === 0, failures, scope: 'Read-only file, tool and version audit. Does not install, repair, connect services or certify execution.' };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = auditSetup(path.resolve(import.meta.dirname, '..'));
    console.log(JSON.stringify(result, null, 2));
    if (!result.passed) process.exitCode = 1;
  } catch { console.error('Setup audit could not inspect required files.'); process.exitCode = 1; }
}
