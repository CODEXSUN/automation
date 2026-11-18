import { connectDatabase } from '../src/api/database/connection.ts';
import { repository } from '../src/api/modules/business/audit-run/repository.ts';
import { parseVariant, workOnce } from '../src/api/modules/business/audit-run/service.ts';
import { randomUUID } from 'node:crypto';
const db = connectDatabase();
try {
  const command = process.argv[2];
  if (command === 'enqueue') console.log(JSON.stringify(await repository(db).enqueue(parseVariant(process.argv[3] ?? 'quick'), randomUUID())));
  else if (command === 'work') {
    const result = await workOnce(db); console.log(JSON.stringify(result ?? { status: 'idle' }));
    if (result && result.status !== 'succeeded') process.exitCode = 1;
  } else if (command === 'history') console.log(JSON.stringify(await repository(db).list(), null, 2));
  else if (command === 'queue') console.log(JSON.stringify(await repository(db).queue(), null, 2));
  else throw new Error('Unknown jobs command.');
} catch { console.error('Job command failed; inspect database readiness and durable history.'); process.exitCode = 1; }
finally { await db.destroy(); }
