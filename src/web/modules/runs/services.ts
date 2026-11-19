import {appFetch} from '../../platform-client.ts';
import type { QueueView, RunView, RunDetail, Variant } from '../../../../contracts/run';
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await appFetch(url, { ...options, credentials: 'same-origin' });
  if (!response.ok) throw new Error(response.status === 429 ? 'The audit queue is busy. Wait for pending work to complete, then retry.' : response.status === 503 ? 'Job storage is unavailable.' : response.status === 409 ? 'This job can no longer be changed. Refresh history.' : 'Unable to load or change local jobs.');
  return response.json() as Promise<T>;
}
export const listRuns = (signal: AbortSignal) => request<{ runs: RunView[] }>('/api/v1/runs', { signal });
export const queueStatus = (signal: AbortSignal) => request<QueueView>('/api/v1/queue', { signal });
export const getRun = (id: string, signal: AbortSignal) => request<RunDetail>(`/api/v1/runs/${id}`, { signal });
export const enqueue = (variant: Variant, key: string) => request<RunView>('/api/v1/runs', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify({ variant }) });
export const cancel = (id: string) => request(`/api/v1/runs/${id}/cancel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
export const reviewRun = (id: string, decision: string, note: string) => request<RunDetail>(`/api/v1/runs/${id}/reviews`, { method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({decision,note}) });
