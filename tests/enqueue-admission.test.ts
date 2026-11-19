import test from 'node:test';import assert from 'node:assert/strict';
import{enqueueAdmission}from'../src/api/modules/business/audit-run/admission.ts';
test('125 simultaneous requests have bounded DB admission and a requester cannot monopolize slots',async()=>{
 const admit=enqueueAdmission();let release!:()=>void,active=0,maximum=0;
 const barrier=new Promise<void>(resolve=>{release=resolve;});
 const requests=Array.from({length:125},(_,i)=>admit('actor-'+i,async()=>{maximum=Math.max(maximum,++active);await barrier;active--;return i;}));
 const settled=Promise.allSettled(requests);release();const result=await settled;
 assert.equal(maximum,4);assert.equal(result.filter(r=>r.status==='fulfilled').length,4);
 for(const item of result.filter(r=>r.status==='rejected'))assert.equal(item.reason.statusCode,429);
 let finish!:()=>void;const hold=new Promise<void>(resolve=>{finish=resolve;});
 const flood=admit('requester-a',()=>hold);await assert.rejects(admit('requester-a',async()=>1),{statusCode:429});
 assert.equal(await admit('requester-b',async()=>2),2);finish();await flood;
 await assert.rejects(admit('requester-a',async()=>{throw Error('fixture database failure');}));
 assert.equal(await admit('requester-a',async()=>3),3);
});
