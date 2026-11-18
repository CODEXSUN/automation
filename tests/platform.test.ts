import test from 'node:test';import assert from 'node:assert/strict';
import {createApplication} from '../src/api/app.ts';
test('operator APIs require Platform, explicit permission and the fixed database tenant',async()=>{
 const original=globalThis.fetch;let tenantId='tenant01';globalThis.fetch=async()=>Response.json({version:1,tenantId,userId:'account1',sessionId:'session1',appKey:'automation',serviceId:'service1',realm:'sa',permissions:['automation/workspace:read'],requestId:'b'.repeat(32)});
 const app=createApplication({NODE_ENV:'test',AUTOMATION_PLATFORM_AUTH:'1',AUTOMATION_PLATFORM_ORIGIN:'http://127.0.0.1:4385',AUTOMATION_PLATFORM_SERVICE_ID:'service1',AUTOMATION_PLATFORM_SERVICE_TOKEN:'a'.repeat(64),AUTOMATION_BROWSER_ORIGINS:'["http://127.0.0.1:4390"]',AUTOMATION_PLATFORM_TENANT_ID:'tenant01'},{} as never);
 try{const headers={'x-platform-grant':'tenant01.'+'c'.repeat(64)};assert.equal((await app.inject('/api/v1/runs')).statusCode,401);assert.equal((await app.inject({url:'/api/v1/workspace',headers})).statusCode,200);
  assert.equal((await app.inject({url:'/api/v1/runs',headers})).statusCode,403);tenantId='tenant02';assert.equal((await app.inject({url:'/api/v1/workspace',headers})).statusCode,403);
 }finally{await app.close();globalThis.fetch=original;}
});
