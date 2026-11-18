import test from 'node:test';
import assert from 'node:assert/strict';
import {validDatabaseHost} from '../src/api/database/connection.ts';
test('CodeShip database target is explicit, isolated and unavailable to native transport',()=>{
 assert.equal(validDatabaseHost(new URL('postgresql://test@127.0.0.1:5432/native'),false),true);
 const url=new URL('postgresql://test@postgres:5432/app_automation');
 assert.equal(validDatabaseHost(url,false),false);assert.equal(validDatabaseHost(url,true),true);
 for(const target of ['postgresql://test@remote.invalid:5432/app_automation','postgresql://test@postgres:5433/app_automation','postgresql://test@postgres:5432/another_app'])assert.equal(validDatabaseHost(new URL(target),true),false);
});
