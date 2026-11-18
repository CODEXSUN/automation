import { connectDatabase } from '../src/api/database/connection.ts';
import { workOnce } from '../src/api/modules/business/audit-run/service.ts';
import { setTimeout } from 'node:timers/promises';

const db = connectDatabase();
let stopping = false;
process.once('SIGINT', () => { stopping = true; });
process.once('SIGTERM', () => { stopping = true; });
console.log('Local audit worker started; one active job, 2-second idle polling.');
try {
  while (!stopping) {
    try {
      const result = await workOnce(db);
      if (result) console.log(JSON.stringify({ publicId: result.publicId, status: result.status, durationMs: result.durationMs }));
      else await setTimeout(2000);
    } catch {
      console.error('Worker could not persist or claim work; inspect database and run history.');
      await setTimeout(2000);
    }
  }
} finally { await db.destroy(); }
