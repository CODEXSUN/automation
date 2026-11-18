import { localScope } from './repository.ts';
import type { WorkerAuthorization } from '../../../../../contracts/run.ts';

export function workerAuthorizer(values: NodeJS.ProcessEnv) {
  return async (actor: string, scope: WorkerAuthorization | null) => {
    if (actor === localScope.actor && !scope && values.NODE_ENV === 'test') return true;
    if (!scope || !/^[a-z0-9]{8}$/.test(scope.tenantId) || scope.tenantId !== values.AUTOMATION_PLATFORM_TENANT_ID ||
      actor !== `${scope.tenantId}:${scope.userId}`) return false;
    const origin = values.AUTOMATION_PLATFORM_ORIGIN;
    if (!origin || !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return false;
    const response = await fetch(new URL('/api/v1/internal/worker-context', origin), {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(3000),
      headers: { 'content-type': 'application/json', 'x-platform-service-id': values.AUTOMATION_PLATFORM_SERVICE_ID ?? '', authorization: `Bearer ${values.AUTOMATION_PLATFORM_SERVICE_TOKEN ?? ''}` },
      body: JSON.stringify(scope),
    });
    if (!response.ok) { await response.body?.cancel(); return false; }
    const result = await response.json() as { allowed?: boolean; actor?: string; tenantId?: string; sessionId?: string };
    return result.allowed === true && result.actor === actor && result.tenantId === scope.tenantId && result.sessionId === scope.sessionId;
  };
}
