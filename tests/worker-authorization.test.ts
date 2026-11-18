import test from 'node:test';import assert from 'node:assert/strict';
import {workerAuthorizer} from '../src/api/modules/business/audit-run/authorization.ts';
test('worker checks current Platform authorization without replacing the original actor',async()=>{
 const original=globalThis.fetch;const scope={tenantId:'tenant01',userId:'account1',sessionId:'session1'};
 const authorize=workerAuthorizer({AUTOMATION_PLATFORM_TENANT_ID:'tenant01',AUTOMATION_PLATFORM_ORIGIN:'http://127.0.0.1:4385',AUTOMATION_PLATFORM_SERVICE_ID:'service1',AUTOMATION_PLATFORM_SERVICE_TOKEN:'a'.repeat(64)});
 try{globalThis.fetch=async()=>Response.json({...scope,allowed:true,actor:'tenant01:account1'});assert.equal(await authorize('tenant01:account1',scope),true);assert.equal(await authorize('tenant02:account1',scope),false);assert.equal(await authorize('automation-local-operator',null),false);
 globalThis.fetch=async()=>new Response(null,{status:403});assert.equal(await authorize('tenant01:account1',scope),false);
 }finally{globalThis.fetch=original;}
});
