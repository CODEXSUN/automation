import { useEffect, useState } from 'react';
import { MasterListV1, type MasterListColumn } from '@workspace/ui/blocks/data-table';
import type { AutomationTool } from '../../../../contracts/automation';
import { getAutomations } from './services';

const columns: MasterListColumn<AutomationTool>[] = [
  { id: 'name', label: 'Name', value: tool => tool.name },
  { id: 'description', label: 'Purpose', value: tool => tool.description },
  { id: 'effect', label: 'Effect', value: tool => tool.effect },
  { id: 'command', label: 'Local command', value: tool => tool.command },
];
export default function AutomationsPage() {
  const [data, setData] = useState<AutomationTool[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(undefined);
    getAutomations(controller.signal).then(result => setData(result.tools)).catch((failure: Error) => {
      if (!controller.signal.aborted) setError(failure.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);
  return <MasterListV1 label="Automations" data={data} columns={columns} getRowId={tool => tool.key}
    loading={loading} error={error} onRetry={() => setRevision(value => value + 1)}
    emptyMessage="No local tools are registered." />;
}
