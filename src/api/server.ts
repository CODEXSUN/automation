import { connectDatabase } from './database/connection.ts';
import { registerRunRoutes } from './modules/business/audit-run/routes.ts';
import { sql } from 'kysely';
import { registerAutomationRoutes, specification } from './modules/automation/routes.ts';
import { createHttpServer, registerFrontend, startHttpServer, registerApiDocumentation } from '@workspace/framework';
import path from 'node:path';
import { appRoot, preflight } from '../../scripts/preflight.ts';
import { appDetails } from '../../contracts/app.ts';



try {
  const config = await preflight();

  const db = connectDatabase();
  const app = createHttpServer({ name: appDetails.name, logLevel: config.logLevel, readinessChecks: [async () => { try { await sql`select 1 from audit_runs limit 1`.execute(db); return true; } catch { return false; } }] });
  app.addHook('onClose', async () => { await db.destroy(); });
  app.setErrorHandler((error, _request, reply) => {
    const code = (error as { statusCode?: number }).statusCode;
    const status = code === 400 || code === 409 ? code : 503;
    reply.code(status).send({ message: status === 503 ? 'Local job storage or execution is unavailable.' : 'Invalid or conflicting job request.' });
  });
  registerRunRoutes(app, db);

  registerAutomationRoutes(app);
  registerApiDocumentation(app, specification);
  registerFrontend(app, path.join(appRoot, 'dist/web'));
  await startHttpServer(app, config);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Application startup failed.');
  process.exitCode = 1;
}
