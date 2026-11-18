import {readFileSync} from 'node:fs';
import {registerPlatformApplication} from '@workspace/sdk/platform-application';
import {createHttpServer,registerApiDocumentation,registerFrontend} from '@workspace/framework';
import {sql,type Kysely} from 'kysely';
import path from 'node:path';
import {appRoot} from '../../scripts/preflight.ts';
import {appDetails} from '../../contracts/app.ts';
import type {AuditDatabase} from './modules/business/audit-run/database/types.ts';
import {registerRunRoutes} from './modules/business/audit-run/routes.ts';
import {registerAutomationRoutes,specification} from './modules/automation/routes.ts';
export function createApplication(values:NodeJS.ProcessEnv,db:Kysely<AuditDatabase>){
  const app = createHttpServer({ name: appDetails.name, logLevel: values.NODE_ENV==='test'?'silent':'info', readinessChecks: [async () => { try { await sql`select 1 from audit_runs limit 1`.execute(db);if(values.CODESHIP_CONTAINER_MODE==='1'){const w=await db.selectFrom('audit_worker').selectAll().where('singleton','=',1).executeTakeFirst();return !!w&&w.redis_ready&&Date.now()-w.seen_at.getTime()<15000;}return true; } catch { return false; } }] });
  app.setErrorHandler((error, _request, reply) => {
    const code = (error as { statusCode?: number }).statusCode;
    const status = code && code >= 400 && code < 500 ? code : 503;
    reply.code(status).send({ message: status === 503 ? 'Local job storage or execution is unavailable.' : 'Invalid or conflicting job request.' });
  });
  const gate=registerPlatformApplication(app,values,'AUTOMATION','automation',{requireTenantBinding:true,version:JSON.parse(readFileSync(new URL('../../package.json',import.meta.url),'utf8')).version,databaseScope:'existing-tenant',permissionForRequest:request=>request.url.startsWith('/api/v1/workspace')?undefined:['GET','HEAD'].includes(request.method)?'automation/operator:read':'automation/operator:write'});
  registerRunRoutes(app, db,request=>{const current=gate.context(request);return current.tenantId+':'+current.userId;},request=>{const c=gate.context(request);return {tenantId:c.tenantId,userId:c.userId,sessionId:c.sessionId};});

  registerAutomationRoutes(app);
  registerApiDocumentation(app, specification);
  registerFrontend(app, path.join(appRoot, 'dist/web'));
return app;
}
