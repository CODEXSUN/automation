import {useUnsavedChangesGuard} from '@workspace/ui/blocks/unsaved-changes-guard';
import {useWorkspaceAuth} from '../../platform';
import { lazy, Suspense, useEffect, useState, useCallback, type ReactNode } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@workspace/ui';
import { AsyncState, ContentBoundary } from '@workspace/ui/blocks/async-state';
import { MainLayout } from '@workspace/ui/layouts/main-layout';
import { appDetails } from '../../../../contracts/app';
import { appBrand, appVersion } from '../../app-shell';
import { pageForPath, pathForPage, pageLabel, type Page } from './routes';

const AutomationsPage = lazy(() => import('../automation/page'));
const RunsPage = lazy(() => import('../runs/page'));
const QueuePage = lazy(() => import('../queue/page'));
const OverviewPage = lazy(() => import('../overview/page'));


const SettingsPage = lazy(() => import('../settings/page'));

export function Application() {
 const identity=useWorkspaceAuth();
 const [reviewDirty,setReviewDirty]=useState(false);
 const guard=useUnsavedChangesGuard({dirty:reviewDirty});
 const navigateRun=useCallback((id?:string)=>{guard.requestNavigation(()=>{setReviewDirty(false);window.history.pushState(null,'',id?`/runs/${id}`:'/runs');window.dispatchEvent(new PopStateEvent('popstate'));});},[guard.requestNavigation]);
  const [header, setHeader] = useState<ReactNode>(null);
  const updateHeader = useCallback((actions: ReactNode) => setHeader(actions), []);
  const [page, setPage] = useState(() => pageForPath(window.location.pathname, appDetails.cityEnabled, appDetails.moduleRoutes));
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  useEffect(() => {
    const sync = () => {
      setCurrentPath(window.location.pathname);
      setPage(pageForPath(window.location.pathname, appDetails.cityEnabled, appDetails.moduleRoutes));
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  function navigate(next: Page) {
    guard.requestNavigation(()=>{setReviewDirty(false);
    const path = pathForPage(next, appDetails.moduleRoutes);
    if (window.location.pathname !== path) window.history.pushState(null, '', path);
    setPage(next);
    window.dispatchEvent(new PopStateEvent('popstate'));
    });
  }
  const currentLabel = pageLabel(page, appDetails.moduleRoutes);
  return <MainLayout className="w-full min-w-0" onLogout={()=>void identity?.logout()} applicationName={appDetails.name} companyBrand={{...appBrand,name:identity?.session.tenant?.name??appBrand.name}}
    launcherCatalogUrl="/platform-api/v1/landing" appItems={[]} navigation={[{ label: 'Workspace', items: [{ label: 'Automations', onSelect: () => navigate('Automations') }, { label: 'Run history', onSelect: () => navigate('Run history') }, {label:'Review inbox',onSelect:()=>navigate('Review inbox')}, { label: 'Queue', onSelect: () => navigate('Queue') }] }]} user={{name:identity?.session.user.displayName??'Workspace user',email:identity?.session.user.email??'',fallback:'WS'}}
    selectedPage={currentLabel} onSettingsSelect={() => navigate('Settings')} onOverviewSelect={() => navigate('Overview')}
    headerActions={['Run history','Review inbox'].includes(page) ? header : null}
    headerBreadcrumbs={[{ label: currentLabel }, ...(page === 'Run history' && /^\/runs\/[a-z0-9]{8}$/.test(currentPath) ? [{ label: currentPath.split('/')[2] }] : page.startsWith('Module:') && currentPath.endsWith('/new') ? [{ label: 'New' }] : page.startsWith('Module:') && currentPath.endsWith('/edit') ? [{ label: 'Edit' }] : [])]} headerName={null}
    statusLabel={page === 'Page not found' ? 'Page not found' : 'Local audit queue'} workspaceTitle="Overview" versionLabel={`v ${appVersion}`}>
    <main className={page==='Overview'||page==='Queue'?'w-full min-w-0 space-y-5 p-4 sm:p-6':'workspace-list-content min-w-0 space-y-5'}>{guard.dialog}
      <ContentBoundary resetKey={page}>
        <Suspense fallback={<AsyncState loading>{null}</AsyncState>}>
          {page === 'Settings' ? <SettingsPage /> : page === 'Automations' ? <AutomationsPage /> : ['Run history','Review inbox'].includes(page) ? <RunsPage onReviewDirty={setReviewDirty} navigateToRun={navigateRun} key={page} reviewOnly={page==='Review inbox'} onHeaderActions={updateHeader} /> : page === 'Queue' ? <QueuePage /> : page === 'Page not found' ?
            <Card><CardHeader><CardTitle>Page not found</CardTitle></CardHeader><CardContent><Button onClick={() => navigate('Overview')}>Go to Overview</Button></CardContent></Card> :
            <OverviewPage />}
        </Suspense>
      </ContentBoundary>
    </main>
  </MainLayout>;
}
