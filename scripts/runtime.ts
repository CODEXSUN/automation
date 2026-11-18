import { spawn } from 'node:child_process';
const children = ['src/api/server.ts', 'scripts/worker.ts'].map(entry => spawn(process.execPath, [entry], { env: process.env, stdio: 'inherit', windowsHide: true }));
let stopping = false;
function stop(code = 0) {
  if (stopping) return; stopping = true; process.exitCode = code;
  for (const child of children) child.kill('SIGTERM');
  const deadline = setTimeout(() => { for (const child of children) if (child.exitCode === null) child.kill('SIGKILL'); }, 100000); deadline.unref();
}
for (const child of children) { child.on('error', () => stop(1)); child.on('exit', code => { if (!stopping) stop(code || 1); }); }
process.on('SIGTERM', () => stop()); process.on('SIGINT', () => stop());
