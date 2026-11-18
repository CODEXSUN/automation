import { createHttpServer, requireLocalRequest, type ApiDocumentationSpecification } from '@workspace/framework';
import { overview, tools } from './service.ts';

export function registerAutomationRoutes(app: ReturnType<typeof createHttpServer>) {
  app.get('/api/v1/overview', { preHandler: async(request,reply)=>{if(!request.headers['x-platform-grant'])await requireLocalRequest(request,reply);} }, async (_request, reply) => {
    reply.header('Cache-Control', 'no-store');
    return overview();
  });
  app.get('/api/v1/automations', { preHandler: requireLocalRequest }, async () => ({ tools }));
}

export const specification: ApiDocumentationSpecification = {
  openapi: '3.1.0', info: { title: 'Automation audit desk', version: '1.0.2' },
  paths: {
    '/api/v1/overview': { get: { summary: 'Local setup overview; configuration presence is not readiness', responses: { '200': { description: 'Setup overview' }, '403': { description: 'Local origin required' } } } },
    '/api/v1/automations': { get: { summary: 'Read-only catalog of operator CLI tools', responses: { '200': { description: 'Tool catalog' }, '403': { description: 'Local origin required' } } } },
    '/api/v1/runs': {
      get: { summary: 'Latest 100 durable local audit runs and registered variants', responses: { '200': { description: 'Run history' }, '403': { description: 'Local origin required' } } },
      post: { summary: 'Enqueue an allowlisted audit variant; no arbitrary scripts', parameters: [{ in: 'header', name: 'Idempotency-Key', required: true, schema: { type: 'string', pattern: '^[a-zA-Z0-9-]{16,80}$' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', additionalProperties: false, required: ['variant'], properties: { variant: { type: 'string', enum: ['quick', 'quality', 'failure-probe'] } } } } } }, responses: { '202': { description: 'Persisted pending run' }, '400': { description: 'Invalid variant or request' }, '403': { description: 'Local origin required' }, '409': { description: 'Idempotency conflict' }, '503': { description: 'Storage unavailable' } } },
    },
    '/api/v1/runs/{id}': { get: { summary: 'Durable run and ordered step results', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', pattern: '^[a-z0-9]{8}$' } }], responses: { '200': { description: 'Run detail' }, '404': { description: 'Not found' } } } },
    '/api/v1/runs/{id}/cancel': { post: { summary: 'Cancel a pending run only', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', pattern: '^[a-z0-9]{8}$' } }], responses: { '200': { description: 'Cancelled' }, '409': { description: 'Not pending' } } } },
    '/api/v1/queue': { get: { summary: 'Durable state counts, not worker heartbeat', responses: { '200': { description: 'Queue state' }, '503': { description: 'Storage unavailable' } } } },
  },
};
