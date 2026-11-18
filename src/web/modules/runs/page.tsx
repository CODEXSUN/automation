import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Button } from '@workspace/ui';
import { MasterListV1, MasterListStatus, type MasterListColumn } from '@workspace/ui/blocks/data-table';
import { RecordDetailV1 } from '@workspace/ui/blocks/record-detail-v1';
import type { RunDetail, RunView, Variant, JobState } from '../../../../contracts/run';
import { cancel, enqueue, getRun, listRuns } from './services';

export function RunStatus({ status }: { status: JobState }) {
  return <MasterListStatus tone={status === 'succeeded' ? 'success' : status === 'failed' || status === 'interrupted' ? 'danger' : status === 'pending' || status === 'running' ? 'warning' : 'neutral'}>{status === 'succeeded' ? 'Passed' : status}</MasterListStatus>;
}
const columns: MasterListColumn<RunView>[] = [
  { id: 'publicId', label: 'Run', value: run => run.publicId },
  { id: 'variant', label: 'Variant', value: run => run.variant },
  { id: 'status', label: 'Status', value: run => run.status, render: run => <RunStatus status={run.status} /> },
  { id: 'createdAt', label: 'Queued', value: run => run.createdAt, render: run => new Date(run.createdAt).toLocaleString() },
  { id: 'queueWaitMs', label: 'Queue wait (ms)', value: run => run.queueWaitMs ?? '' },
  { id: 'durationMs', label: 'Execution (ms)', value: run => run.durationMs ?? '' },
];
function idFromPath() { return /^\/runs\/([a-z0-9]{8})$/.exec(window.location.pathname)?.[1]; }
export default function RunsPage({ onHeaderActions }: { onHeaderActions: (actions: ReactNode) => void }) {
  const [id, setId] = useState(idFromPath);
  const [runs, setRuns] = useState<RunView[]>([]);
  const [detail, setDetail] = useState<RunDetail>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const navigate = useCallback((next?: string) => {
    window.history.pushState(null, '', next ? `/runs/${next}` : '/runs');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);
  useEffect(() => { const sync = () => setId(idFromPath()); window.addEventListener('popstate', sync); return () => window.removeEventListener('popstate', sync); }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(undefined); setDetail(undefined);
    let timer: ReturnType<typeof setTimeout>;
    async function refresh() {
      try {
        if (id) setDetail(await getRun(id, controller.signal));
        else setRuns((await listRuns(controller.signal)).runs);
        setError(undefined);
      } catch (failure) { if (!controller.signal.aborted) setError((failure as Error).message); }
      finally { if (!controller.signal.aborted) { setLoading(false); timer = setTimeout(refresh, 3000); } }
    }
    void refresh();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [id, revision]);
  const start = useCallback(async (variant: Variant) => {
    setBusy(true); setError(undefined);
    try { const run = await enqueue(variant, crypto.randomUUID()); navigate(run.publicId); }
    catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }, [navigate]);
  useEffect(() => {
    onHeaderActions(<>{id && <Button size="sm" variant="outline" onClick={() => navigate()}>Back to history</Button>}
      <Button size="sm" variant="outline" disabled={busy} onClick={() => void start('failure-probe')}>Failure probe</Button>
      <Button size="sm" variant="outline" disabled={busy} onClick={() => void start('quality')}>Quality audit</Button>
      <Button size="sm" disabled={busy} onClick={() => void start('quick')}>Quick audit</Button></>);
    return () => onHeaderActions(null);
  }, [id, busy, onHeaderActions, navigate, start]);
  if (id) return <RecordDetailV1 title={`Run ${id}`} loading={loading} error={error} onRetry={() => setRevision(value => value + 1)}
    status={detail && <RunStatus status={detail.status} />} description="Green means every executed step passed and the final result was stored. Failure probe is intentionally red."
    actions={detail?.status === 'pending' && <Button size="sm" variant="outline" disabled={busy} onClick={async () => { setBusy(true); try { await cancel(id); setRevision(value => value + 1); } catch (failure) { setError((failure as Error).message); } finally { setBusy(false); } }}>Cancel pending job</Button>}
    sections={detail ? [{ id: 'run', title: 'Execution', fields: [
      { id: 'variant', label: 'Variant', value: detail.variant }, { id: 'queued', label: 'Queued', value: new Date(detail.createdAt).toLocaleString() },
      { id: 'duration', label: 'Execution time', value: detail.durationMs === null ? 'Not completed' : `${detail.durationMs} ms` },
      { id: 'wait', label: 'Queue wait', value: detail.queueWaitMs === null ? 'Waiting' : `${detail.queueWaitMs} ms` },
    ] }, { id: 'steps', title: 'Step history', fields: detail.steps.map(step => ({ id: String(step.position), label: `${step.position + 1}. ${step.key}`, value: `${step.status} · ${step.reason} · ${step.durationMs} ms` })) }] : []} />;
  return <MasterListV1 label="Run history" data={runs} columns={columns} getRowId={run => run.publicId}
    loading={loading} error={error} onRetry={() => setRevision(value => value + 1)}
    actions={[{ id: 'view', label: 'View run', onSelect: run => navigate(run.publicId) }]} onOpen={run => navigate(run.publicId)}
    emptyMessage="No audit jobs yet. Start a quick audit from the app header." />;
}
