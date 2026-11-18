import { requireLocalRequest, type createHttpServer } from '@workspace/framework';
import type { Kysely } from 'kysely';
import type { AuditDatabase } from './database/types.ts';
import { repository } from './repository.ts';
import { parseVariant, variants } from './service.ts';

export function registerRunRoutes(app: ReturnType<typeof createHttpServer>, db: Kysely<AuditDatabase>) {
  app.addHook('onRequest', async (request, reply) => {
    if (request.url.startsWith('/api/v1/runs') || request.url.startsWith('/api/v1/queue')) {
      reply.header('Cache-Control', 'no-store');
      await requireLocalRequest(request, reply);
    }
  });
  const repo = repository(db);
  app.get('/api/v1/runs', async () => ({ runs: await repo.list(), variants }));
  app.get('/api/v1/queue', async () => repo.queue());
  app.get<{ Params: { id: string } }>('/api/v1/runs/:id', async (request, reply) => {
    if (!/^[a-z0-9]{8}$/.test(request.params.id)) return reply.code(400).send({ message: 'Invalid run reference.' });
    const run = await repo.detail(request.params.id);
    return run ?? reply.code(404).send({ message: 'Run not found.' });
  });
  app.post<{ Body: { variant?: unknown }; Headers: { 'idempotency-key'?: string } }>('/api/v1/runs', async (request, reply) => {
    const body = request.body;
    if (!body || typeof body !== 'object' || Object.keys(body).some(key => key !== 'variant')) return reply.code(400).send({ message: 'Only a registered variant is accepted.' });
    const key = request.headers['idempotency-key'];
    if (!key || !/^[a-zA-Z0-9-]{16,80}$/.test(key)) return reply.code(400).send({ message: 'Provide an idempotency key.' });
    const run = await repo.enqueue(parseVariant(body.variant), key);
    return reply.code(202).send(run);
  });
  app.post<{ Params: { id: string } }>('/api/v1/runs/:id/cancel', async (request, reply) => {
    if (!/^[a-z0-9]{8}$/.test(request.params.id)) return reply.code(400).send({ message: 'Invalid run reference.' });
    return await repo.cancel(request.params.id) ? { cancelled: true } : reply.code(409).send({ message: 'Only pending jobs can be cancelled.' });
  });
}
