// Bound only audit acceptance work after trusted Platform authorization. Worker traffic uses its own process/pool.
export function enqueueAdmission(){
 const active=new Set<string>();
 return async function admit<T>(actor:string,work:()=>Promise<T>):Promise<T>{
  if(active.size>=4||active.has(actor))throw Object.assign(Error('Audit acceptance is busy. Retry shortly.'),{statusCode:429});
  active.add(actor);
  try{return await work();}finally{active.delete(actor);}
 };
}
