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
  return <Card><CardHeader><CardTitle>Local PostgreSQL queue</CardTitle></CardHeader><CardContent className="space-y-4">
    <p>One active read-only audit at a time. Jobs are durable; a separate worker processes them without Redis or AI.</p>
    {error ? <div role="alert">{error}<Button variant="outline" onClick={() => setRevision(value => value + 1)}>Retry</Button></div> : !data ? <p role="status">Loading queue…</p> : <>
      <dl className="grid gap-4 sm:grid-cols-3">{(['pending', 'running', 'succeeded', 'failed', 'interrupted', 'cancelled'] as const).map(key => <div key={key}><dt>{key}</dt><dd>{data[key]}</dd></div>)}</dl>
      <p className="text-sm">Latest accepted run: {data.latest ? `${data.latest.publicId} · ${data.latest.status}` : 'None'}. These are stored job counts, not a live worker heartbeat.</p>
    </>}
  </CardContent></Card>;
}
