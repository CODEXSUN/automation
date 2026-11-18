import { spawnSync } from 'node:child_process';
const files = ['tests/database/audit-run.test.ts', ...(process.env.AUTOMATION_TEST_REDIS_URL ? ['tests/database/bullmq.test.ts'] : [])];
const result = spawnSync(process.execPath, ['--test', '--test-concurrency=1', ...files], {
  stdio: 'inherit', env: { ...process.env, NODE_ENV: 'test' }, windowsHide: true,
});
process.exitCode = result.status ?? 1;
