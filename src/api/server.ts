import { registerAutomationRoutes, specification } from './modules/automation/routes.ts';
import { createHttpServer, registerFrontend, startHttpServer, registerApiDocumentation } from '@workspace/framework';
import path from 'node:path';
import { appRoot, preflight } from '../../scripts/preflight.ts';
import { appDetails } from '../../contracts/app.ts';



try {
  const config = await preflight();

  const app = createHttpServer({ name: appDetails.name, logLevel: config.logLevel });

  registerAutomationRoutes(app);
  registerApiDocumentation(app, specification);
  registerFrontend(app, path.join(appRoot, 'dist/web'));
  await startHttpServer(app, config);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Application startup failed.');
  process.exitCode = 1;
}
