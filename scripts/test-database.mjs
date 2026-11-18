import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, ['--test', 'tests/database/audit-run.test.ts'], {
  stdio: 'inherit', env: { ...process.env, NODE_ENV: 'test' }, windowsHide: true,
});
process.exitCode = result.status ?? 1;
