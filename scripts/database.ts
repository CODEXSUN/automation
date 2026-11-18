import { connectDatabase } from '../src/api/database/connection.ts';
import { migrator } from '../src/api/database/migrations.ts';
const db = connectDatabase();
try {
  const runner = migrator(db);
  if (process.argv.includes('--migrate')) {
    const result = await runner.migrateToLatest();
    if (result.error) throw new Error('Migration failed.');
    console.log(JSON.stringify(result.results));
  } else {
    const rows = await runner.getMigrations();
    console.log(JSON.stringify(rows.map(row => ({ name: row.name, applied: !!row.executedAt }))));
  }
} catch { console.error('Database command failed; verify local connection and migration history.'); process.exitCode = 1; }
finally { await db.destroy(); }
