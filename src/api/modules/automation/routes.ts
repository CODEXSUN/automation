import { createHttpServer, requireLocalRequest, type ApiDocumentationSpecification } from '@workspace/framework';
import { overview, tools } from './service.ts';

export function registerAutomationRoutes(app: ReturnType<typeof createHttpServer>) {
  app.get('/api/v1/overview', { preHandler: requireLocalRequest }, async (_request, reply) => {
    reply.header('Cache-Control', 'no-store');
    return overview();
  });
  app.get('/api/v1/automations', { preHandler: requireLocalRequest }, async () => ({ tools }));
}

export const specification: ApiDocumentationSpecification = {
  openapi: '3.1.0', info: { title: 'Automation setup desk', version: '1.0.1' },
  paths: {
    '/api/v1/overview': { get: { summary: 'Local setup overview; configuration presence is not readiness', responses: { '200': { description: 'Setup overview' }, '403': { description: 'Local origin required' } } } },
    '/api/v1/automations': { get: { summary: 'Read-only catalog of operator CLI tools', responses: { '200': { description: 'Tool catalog' }, '403': { description: 'Local origin required' } } } },
  },
};
