import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@workspace/ui';
import type { DeskOverview } from '../../../../contracts/automation';
import { getOverview } from '../automation/services';

export default function OverviewPage() {
  const [data, setData] = useState<DeskOverview>();
  const [error, setError] = useState<string>();
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(undefined);
    getOverview(controller.signal).then(setData).catch((failure: Error) => {
      if (!controller.signal.aborted) setError(failure.message);
    });
    return () => controller.abort();
  }, [revision]);
  return <Card><CardHeader><CardTitle>Automation desk</CardTitle></CardHeader><CardContent className="space-y-4">
    <p>Run deterministic tools independently. Connect Zetro when a workflow needs AI assistance.</p>
    {error ? <div role="alert"><p>{error}</p><Button variant="outline" onClick={() => setRevision(value => value + 1)}>Retry</Button></div> : !data ? <p role="status">Loading setup…</p> : <dl className="grid gap-3 sm:grid-cols-2">
      <div><dt>Available tools</dt><dd>{data.tools} local CLI tools</dd></div>
      <div><dt>Execution</dt><dd>Local PostgreSQL audit queue; start a fixed variant from Run history</dd></div>
      <div><dt>PostgreSQL configuration</dt><dd>{data.setup.database}</dd></div>
      <div><dt>Redis configuration</dt><dd>{data.setup.redis}</dd></div>
    </dl>}
    <p className="text-sm text-muted-foreground">Run history records passed, failed and interrupted audits with per-step timings. A separate worker processes pending jobs. Redis, AI and schedules are not required or enabled. Configuration presence does not verify service readiness.</p>
  </CardContent></Card>;
}
