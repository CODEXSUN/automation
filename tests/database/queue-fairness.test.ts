import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {setTimeout as delay} from 'node:timers/promises';
import {createHttpServer} from '@workspace/framework';
import {connectDatabase} from '../../src/api/database/connection.ts';
import {migrator} from '../../src/api/database/migrations.ts';
import {repository} from '../../src/api/modules/business/audit-run/repository.ts';
import {registerRunRoutes} from '../../src/api/modules/business/audit-run/routes.ts';
import {queueLimits} from '../../contracts/run.ts';
import {transientDatabaseError} from '../../src/api/database/startup.ts';

test('125 concurrent requests: bounded acceptance, idempotent replay, fair dispatch and HTTP backpressure',{timeout:90000},async()=>{
 const db=connectDatabase(true),repo=repository(db),created:string[]=[];
 const app=createHttpServer({name:'queue-overload-fixture',logLevel:'silent'});
 const started=performance.now(),actor='fixture:requester-a';
 const keys=Array.from({length:125},()=>randomUUID());
 const acceptedKeys=new Map<string,string>();
 let transportRetries=0;
 const enqueue=async(key:string,owner=actor)=>{
  for(let attempt=0;attempt<3;attempt++)try{const run=await repo.enqueue('quick',key,owner);created.push(run.publicId);acceptedKeys.set(run.publicId,key);return {run,status:202};}
  catch(error){const failure=error as {statusCode?:number;message?:string};if(failure.statusCode)return {status:failure.statusCode};
   if(attempt<2&&(transientDatabaseError(error)||failure.message==='timeout exceeded when trying to connect')){transportRetries++;await delay(100);continue;}throw error;}
  throw Error('Fixture acceptance retry bound exceeded.');
 };
 const post=(key:string)=>app.inject({method:'POST',url:'/api/v1/runs',remoteAddress:'127.0.0.1',headers:{host:'127.0.0.1:4395',origin:'http://127.0.0.1:4395','idempotency-key':key},payload:{variant:'quick'}});
 try{
  registerRunRoutes(app,db,()=>actor);await app.ready();assert.equal((await migrator(db).migrateToLatest()).error,undefined);
  assert.equal((await repo.queue()).pending,0,'Fixture database must have no unrelated pending work.');
  const foreign=await enqueue(randomUUID(),'fixture:foreign');assert.equal(foreign.status,202);
  await db.updateTable('audit_runs').set({tenant_id:'fixture-foreign-tenant'}).where('public_id','=',foreign.run!.publicId).execute();
  assert.equal(await repo.detail(foreign.run!.publicId),null);assert.equal(await repo.cancel(foreign.run!.publicId),undefined);
  await assert.rejects(repo.review(foreign.run!.publicId,actor,'accepted','Foreign fixture must stay hidden.'),{statusCode:409});
  const burst=await Promise.all(keys.map(async key=>{const response=await post(key);if(response.statusCode!==202)return {status:response.statusCode};const run=response.json();created.push(run.publicId);acceptedKeys.set(run.publicId,key);return {status:202,run};}));
  const acceptedCount=burst.filter(r=>r.status===202).length;
  assert.ok(acceptedCount>=1&&acceptedCount<=queueLimits.requesterPending);
  assert.equal(burst.filter(r=>r.status===429).length,125-acceptedCount);
  while((await repo.queue()).pending<queueLimits.requesterPending)assert.equal((await enqueue(randomUUID())).status,202);
  await assert.rejects(repo.enqueue('quick',randomUUID(),actor),{statusCode:429});
  const accepted=burst.findIndex(r=>r.status===202),first=burst[accepted].run!;
  await assert.rejects(repository(db,()=>first.publicId).enqueue('quick',randomUUID(),'fixture:collision'),/Unable to allocate/);
  assert.equal((await repo.enqueue('quick',keys[accepted],actor)).publicId,first.publicId);
  await assert.rejects(repo.enqueue('quality',keys[accepted],actor),{statusCode:409});
  await assert.rejects(repo.enqueue('quick',keys[accepted],'fixture:requester-b'),{statusCode:409});
  const other=await enqueue(randomUUID(),'fixture:requester-b');assert.equal(other.status,202);
  const firstClaim=await repo.claim();assert.ok(firstClaim);assert.equal(firstClaim.created_by,actor);
  await repo.finish(firstClaim.id,true,1);
  const pending=await repo.pending();assert.equal(pending[0],other.run!.publicId);
  const staleId=(await repo.pending()).find(id=>id!==other.run!.publicId)!;
  assert.equal(await repo.claim(staleId),null,'Out-of-order Redis delivery cannot bypass fairness.');
  const fair=await repo.claim(other.run!.publicId);assert.ok(fair);assert.equal(fair.created_by,'fixture:requester-b');await repo.finish(fair.id,true,1);
  let fill=0;while((await repo.queue()).pending<96){assert.equal((await enqueue(randomUUID(),'fixture:fill-'+Math.floor(fill/8))).status,202);fill++;}
  const race=await Promise.all(Array.from({length:8},(_,i)=>enqueue(randomUUID(),'fixture:race-'+i)));
  assert.equal(race.filter(r=>r.status===202).length,4);assert.equal(race.filter(r=>r.status===429).length,4);assert.equal((await repo.queue()).pending,queueLimits.pending);
  assert.equal((await repo.enqueue('quick',acceptedKeys.get(staleId)!,actor)).publicId,staleId);
  const response=await app.inject({method:'POST',url:'/api/v1/runs',remoteAddress:'127.0.0.1',headers:{host:'127.0.0.1:4395',origin:'http://127.0.0.1:4395','idempotency-key':randomUUID()},payload:{variant:'quick'}});
  assert.equal(response.statusCode,429);assert.equal(response.headers['retry-after'],'2');
  console.log(JSON.stringify({fixture:'queue-overload',concurrentHttpRequests:125,httpAccepted:acceptedCount,httpBackpressure:125-acceptedCount,globalCapacityRace:8,transportRetries,accepted:created.length,pendingLimit:queueLimits.pending,requesterLimit:queueLimits.requesterPending,elapsedMs:Math.round(performance.now()-started)}));
 }finally{
  await app.close();
  if(created.length){const rows=await db.selectFrom('audit_runs').select('id').where('public_id','in',created).execute();if(rows.length){const ids=rows.map(r=>r.id);await db.deleteFrom('audit_reviews').where('run_id','in',ids).execute();await db.deleteFrom('audit_steps').where('run_id','in',ids).execute();}await db.deleteFrom('audit_runs').where('public_id','in',created).execute();}
  await db.destroy();
 }
});
