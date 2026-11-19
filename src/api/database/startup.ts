import {waitForReadiness} from '@workspace/framework';
import {sql,type Kysely} from 'kysely';
import type {AuditDatabase} from '../modules/business/audit-run/database/types.ts';

export function transientDatabaseError(error:unknown):boolean {
  const codes=new Set(['57P03','ECONNREFUSED','ECONNRESET','ETIMEDOUT','08006']);
  let current=error;
  for(let level=0;level<4&&current&&typeof current==='object';level++){
    const value=current as {code?:string;cause?:unknown};
    if(value.code&&codes.has(value.code))return true;
    current=value.cause;
  }
  return false;
}
export async function waitForJobDatabase(db:Kysely<AuditDatabase>,signal?:AbortSignal){
  return waitForReadiness(async()=>{
    // Existing module tables must be available; startup never migrates or seeds.
    await sql`select 1 from audit_runs limit 1`.execute(db);
    await sql`select 1 from audit_worker limit 1`.execute(db);
    return true;
  },{timeoutMs:60000,maxAttempts:50,initialDelayMs:250,maxDelayMs:2000,retryOnError:transientDatabaseError,signal});
}
