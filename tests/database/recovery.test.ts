import test from 'node:test';import assert from 'node:assert/strict';
import net from 'node:net';import {randomUUID} from 'node:crypto';import {setTimeout as delay} from 'node:timers/promises';
import {sql} from 'kysely';import {startDelivery} from '@workspace/execution';
import {connectDatabase} from '../../src/api/database/connection.ts';import {migrator} from '../../src/api/database/migrations.ts';
import {waitForJobDatabase} from '../../src/api/database/startup.ts';
import {repository} from '../../src/api/modules/business/audit-run/repository.ts';import {workOnce} from '../../src/api/modules/business/audit-run/service.ts';

async function proxy(target:URL){
 const sockets=new Set<net.Socket>();let available=true,port=0,listening=false;
 const server=net.createServer(client=>{
  if(!available){client.destroy();return;}
  const remote=net.connect(Number(target.port||6379),target.hostname);
  for(const socket of [client,remote]){sockets.add(socket);socket.on('error',()=>{client.destroy();remote.destroy();});socket.on('close',()=>sockets.delete(socket));}
  client.pipe(remote).pipe(client);
 });
 const listen=async()=>{await new Promise<void>((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>{server.removeListener('error',reject);resolve();});});port=(server.address() as net.AddressInfo).port;listening=true;};
 const drop=()=>{for(const socket of sockets)socket.destroy();};
 const close=async()=>{drop();if(listening){await new Promise<void>(resolve=>server.close(()=>resolve()));listening=false;}};
 await listen();const local=new URL(target);local.hostname='127.0.0.1';local.port=String(port);
 return {url:local.href,listen,close,drop,setAvailable(value:boolean){available=value;if(!value)drop();}};
}
async function until(check:()=>Promise<boolean>,timeout=20000){const start=performance.now();while(performance.now()-start<timeout){if(await check())return;await delay(100);}throw Error('Fixture recovery deadline exceeded.');}

test('read-only PG startup tolerates refused transport; idle disconnect recovers without process crash',{timeout:25000},async()=>{
 const direct=connectDatabase(true);try{assert.equal((await migrator(direct).migrateToLatest()).error,undefined);}finally{await direct.destroy();}
 const original=process.env.AUTOMATION_TEST_DATABASE_URL!,bridge=await proxy(new URL(original));let db:ReturnType<typeof connectDatabase>|undefined;
 try{
  process.env.AUTOMATION_TEST_DATABASE_URL=bridge.url;db=connectDatabase(true);process.env.AUTOMATION_TEST_DATABASE_URL=original;
  await bridge.close();const start=performance.now(),waiting=waitForJobDatabase(db);await delay(100);await bridge.listen();const result=await waiting;
  assert.ok(result.attempts>=2);await sql`select 1`.execute(db);
  bridge.drop();await delay(100);await waitForJobDatabase(db);await sql`select 1`.execute(db);
  console.log(JSON.stringify({fixture:'pg-startup-idle-recovery',attempts:result.attempts,elapsedMs:Math.round(performance.now()-start)}));
 }finally{process.env.AUTOMATION_TEST_DATABASE_URL=original;await db?.destroy();await bridge.close();}
});

test('Redis startup and targeted transport outage preserve PG jobs and resume automatic delivery',{timeout:60000},async()=>{
 const bridge=await proxy(new URL(process.env.AUTOMATION_TEST_REDIS_URL!)),db=connectDatabase(true),repo=repository(db),ids:string[]=[],health:boolean[]=[];
 let delivery:Awaited<ReturnType<typeof startDelivery>>|undefined;
 try{
  assert.equal((await migrator(db).migrateToLatest()).error,undefined);bridge.setAvailable(false);
  delivery=await startDelivery({url:bridge.url,namespace:'automation-test-'+randomUUID(),pending:()=>repo.pending(),heartbeat:async value=>{health.push(value);await repo.heartbeat(value);},process:ref=>workOnce(db,ref,async()=>true)});
  const scope={tenantId:'tenant01',userId:'account1',sessionId:'session1'};
  const first=await repo.enqueue('quick',randomUUID(),'tenant01:account1',scope);ids.push(first.publicId);
  await until(async()=>health.includes(false),8000);assert.equal((await repo.detail(first.publicId))?.status,'pending');
  const start=performance.now();bridge.setAvailable(true);
  await until(async()=>(await repo.detail(first.publicId))?.status==='succeeded');
  assert.equal((await repo.detail(first.publicId))?.creator,'tenant01:account1');
  health.length=0;bridge.setAvailable(false);await until(async()=>health.includes(false),8000);
  const second=await repo.enqueue('quick',randomUUID(),'tenant01:account1',scope);ids.push(second.publicId);assert.equal((await repo.detail(second.publicId))?.status,'pending');
  bridge.setAvailable(true);await until(async()=>(await repo.detail(second.publicId))?.status==='succeeded');
  console.log(JSON.stringify({fixture:'redis-startup-outage-recovery',durableRuns:ids.length,elapsedMs:Math.round(performance.now()-start)}));
 }finally{
  bridge.setAvailable(true);await delivery?.close();
  if(ids.length){const rows=await db.selectFrom('audit_runs').select('id').where('public_id','in',ids).execute();for(const row of rows){await db.deleteFrom('audit_reviews').where('run_id','=',row.id).execute();await db.deleteFrom('audit_steps').where('run_id','=',row.id).execute();await db.deleteFrom('audit_runs').where('id','=',row.id).execute();}}
  await db.destroy();await bridge.close();
 }
});
