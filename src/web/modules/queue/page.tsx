import { useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@workspace/ui';
import type { QueueView } from '../../../../contracts/run';
import { queueStatus } from '../runs/services';

export default function QueuePage() {
  const [data, setData] = useState<QueueView>();
  const [error, setError] = useState<string>();
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); let timer: ReturnType<typeof setTimeout>;
    async function refresh() {
      try { setData(await queueStatus(controller.signal)); setError(undefined); }
      catch (failure) { if (!controller.signal.aborted) setError((failure as Error).message); }
      finally { if (!controller.signal.aborted) timer = setTimeout(refresh, 3000); }
    }
    void refresh(); return () => { controller.abort(); clearTimeout(timer); };
  }, [revision]);
  return <Card><CardHeader><CardTitle>Delivery and worker health</CardTitle></CardHeader><CardContent className="space-y-4">
    <p>PostgreSQL preserves accepted work and results. Redis/BullMQ delivers references to the managed worker, one audit at a time.</p>
    {error ? <div role="alert">{error}<Button variant="outline" onClick={() => setRevision(value => value + 1)}>Retry</Button></div> : !data ? <p role="status">Loading queue…</p> : <>
      <dl className="grid gap-4 sm:grid-cols-3">{(['pending', 'running', 'succeeded', 'failed', 'interrupted', 'cancelled'] as const).map(key => <div key={key}><dt>{key}</dt><dd>{data[key]}</dd></div>)}</dl>
      <dl className="grid gap-4 sm:grid-cols-3"><div><dt>Worker</dt><dd>{data.worker?.online?'Online':'Offline or stale'}</dd></div><div><dt>Redis delivery</dt><dd>{data.worker?.redisReady?'Connected':'Unavailable'}</dd></div><div><dt>Last heartbeat</dt><dd>{data.worker?.lastSeen?new Date(data.worker.lastSeen).toLocaleString():'None'}</dd></div></dl>
      <p className="text-sm break-words">Latest accepted run: {data.latest ? `${data.latest.publicId} · ${data.latest.status}` : 'None'}. Redis outages retain pending work; review interrupted results before starting a new run.</p>
      {data.capacity&&<p className="text-sm">Up to {data.capacity.pending} pending audits per installation and {data.capacity.requesterPending} per requester. Least recently served requesters run first; duplicate retries keep the same job.</p>}
    </>}
  </CardContent></Card>;
}
