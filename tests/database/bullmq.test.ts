import test from 'node:test';import assert from 'node:assert/strict';import {randomUUID}from'node:crypto';
import {startDelivery}from'@workspace/execution';
import {connectDatabase}from'../../src/api/database/connection.ts';import{migrator}from'../../src/api/database/migrations.ts';
import{repository}from'../../src/api/modules/business/audit-run/repository.ts';import{workOnce}from'../../src/api/modules/business/audit-run/service.ts';

test('BullMQ delivers durable actor-bound work and preserves denial, review and original creator', {timeout:60000},async()=>{
 assert.ok(process.env.AUTOMATION_TEST_REDIS_URL,'Configure an isolated test Redis URL.');
 const db=connectDatabase(true),repo=repository(db),ids:string[]=[];
 let delivery:Awaited<ReturnType<typeof startDelivery>>|undefined;
 try{const m=await migrator(db).migrateToLatest();assert.equal(m.error,undefined);
  let allowed=true;
  delivery=await startDelivery({url:process.env.AUTOMATION_TEST_REDIS_URL!,namespace:'automation-test-'+randomUUID(),pending:()=>repo.pending(),heartbeat:r=>repo.heartbeat(r),process:id=>workOnce(db,id,async(actor,scope)=>allowed&&actor==='tenant01:account1'&&scope?.tenantId==='tenant01')});
  async function wait(id:string){for(let n=0;n<200;n++){const r=await repo.detail(id);if(r&&!['pending','running'].includes(r.status))return r;await new Promise(r=>setTimeout(r,100));}throw Error('Worker did not complete.');}
  const scope={tenantId:'tenant01',userId:'account1',sessionId:'session1'};
  const run=await repo.enqueue('quick','test-'+randomUUID(),'tenant01:account1',scope);ids.push(run.publicId);
  const result=await wait(run.publicId);assert.equal(result.status,'succeeded');assert.equal(result.creator,'tenant01:account1');
  const reviewed=await repo.review(run.publicId,'tenant01:reviewer','accepted','Checked the step evidence.');assert.equal(reviewed?.reviews.length,1);assert.equal(reviewed?.status,'succeeded');
  allowed=false;const denied=await repo.enqueue('quick','test-'+randomUUID(),'tenant01:account1',scope);ids.push(denied.publicId);
  const rejected=await wait(denied.publicId);assert.equal(rejected.status,'failed');assert.equal(rejected.outcomeReason,'authorization-denied');assert.equal(rejected.steps.length,0);
  assert.equal((await repo.queue()).worker?.redisReady,true);
 }finally{await delivery?.close();for(const id of ids){const r=await repo.raw(id);if(r){await db.deleteFrom('audit_reviews').where('run_id','=',r.id).execute();await db.deleteFrom('audit_steps').where('run_id','=',r.id).execute();await db.deleteFrom('audit_runs').where('id','=',r.id).execute();}}await db.destroy();}
});
