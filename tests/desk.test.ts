import test from 'node:test';
import assert from 'node:assert/strict';
import { createHttpServer } from '@workspace/framework';
import { registerAutomationRoutes } from '../src/api/modules/automation/routes.ts';
import { overview, tools } from '../src/api/modules/automation/service.ts';

test('desk only exposes allowlisted catalog and no browser command execution', async () => {
  const app = createHttpServer({ name: 'automation-test', logLevel: 'silent' });
  registerAutomationRoutes(app);
  try {
    const response = await app.inject({ url: '/api/v1/automations', headers: { host: '127.0.0.1:4395' }, remoteAddress: '127.0.0.1' });
    assert.equal(response.statusCode, 200);
    assert.equal(response.json().tools.length, tools.length);
    assert.equal((await app.inject({ method: 'POST', url: '/api/v1/automations', payload: { command: 'anything' } })).statusCode, 404);
  } finally { await app.close(); }
});

test('desk rejects remote peers, hostile Host and cross-origin requests', async () => {
  const app = createHttpServer({ name: 'automation-test', logLevel: 'silent' });
  registerAutomationRoutes(app);
  try {
    for (const request of [
      { headers: { host: '127.0.0.1:4395' }, remoteAddress: '192.0.2.1' },
      { headers: { host: 'attacker.example' }, remoteAddress: '127.0.0.1' },
      { headers: { host: '127.0.0.1:4395', origin: 'https://attacker.example' }, remoteAddress: '127.0.0.1' },
    ]) assert.equal((await app.inject({ url: '/api/v1/overview', ...request })).statusCode, 403);
  } finally { await app.close(); }
});

test('configuration overview discloses presence only and never claims readiness', () => {
  const data = overview({ AUTOMATION_DATABASE_URL: 'secret-database', AUTOMATION_REDIS_URL: 'secret-redis' });
  assert.equal(data.setup.database, 'configured-unverified');
  assert.equal(data.setup.redis, 'configured-unverified');
  assert.equal(data.setup.aiRequired, false);
  assert.equal(JSON.stringify(data).includes('secret'), false);
  assert.equal(overview({}).setup.database, 'not-configured');
});
