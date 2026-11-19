import test from 'node:test';import assert from 'node:assert/strict';
import{transientDatabaseError}from'../src/api/database/startup.ts';
test('only known startup transport/recovery failures retry; authority and schema failures stay fatal',()=>{
 for(const code of ['57P03','ECONNREFUSED','ECONNRESET','ETIMEDOUT','08006'])assert.equal(transientDatabaseError({code}),true);
 assert.equal(transientDatabaseError({cause:{code:'ECONNRESET'}}),true);
 for(const code of ['28P01','42501','42P01','3D000','23505'])assert.equal(transientDatabaseError({code}),false);
 assert.equal(transientDatabaseError(Error('private configuration')),false);
});
