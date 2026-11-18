import {appFetch} from '../../platform-client.ts';
import type { AutomationTool, DeskOverview } from '../../../../contracts/automation';

async function get<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await appFetch(path, { signal, credentials: 'same-origin' });
  if (!response.ok) throw new Error(response.status === 403 ? 'This desk is available from the local application origin only.' : 'Unable to load the automation desk.');
  return response.json() as Promise<T>;
}
export const getOverview = (signal: AbortSignal) => get<DeskOverview>('/api/v1/overview', signal);
export const getAutomations = (signal: AbortSignal) => get<{ tools: AutomationTool[] }>('/api/v1/automations', signal);
