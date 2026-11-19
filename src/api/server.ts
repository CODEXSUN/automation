import {startHttpServer} from '@workspace/framework';
import {preflight} from '../../scripts/preflight.ts';
import {connectDatabase} from './database/connection.ts';
import {createApplication} from './app.ts';
import {waitForJobDatabase} from './database/startup.ts';
try{const config=await preflight();const db=connectDatabase();try{await waitForJobDatabase(db);const app=createApplication(config.values,db);app.addHook('onClose',async()=>{await db.destroy();});await startHttpServer(app,config);}catch(error){await db.destroy();throw error;}}
catch{console.error('Automation startup failed. Check private Platform and database configuration.');process.exitCode=1;}
