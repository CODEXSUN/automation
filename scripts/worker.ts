import { connectDatabase } from '../src/api/database/connection.ts';
import { workOnce } from '../src/api/modules/business/audit-run/service.ts';
import { repository } from '../src/api/modules/business/audit-run/repository.ts';
import { startDelivery } from '@workspace/execution';
import { setTimeout } from 'node:timers/promises';

const db = connectDatabase();
const redis = process.env.AUTOMATION_REDIS_URL;
if (!redis) { await db.destroy(); throw new Error('The managed worker requires Redis delivery configuration.'); }
const repo = repository(db);
const delivery = await startDelivery({ url: redis, namespace: process.env.AUTOMATION_QUEUE_NAMESPACE ?? 'automation-local-audits',
  pending: () => repo.pending(), process: reference => workOnce(db, reference), heartbeat: ready => repo.heartbeat(ready) });
let stopping = false;
process.once('SIGINT', () => { stopping = true; });
process.once('SIGTERM', () => { stopping = true; });
console.log('BullMQ audit worker started; durable PostgreSQL reconciliation and one active job.');
try {
  while (!stopping) {
    await setTimeout(500);
  }
} finally { await delivery.close(); await repo.heartbeat(false); await db.destroy(); }
