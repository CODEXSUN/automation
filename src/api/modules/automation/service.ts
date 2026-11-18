import type { AutomationTool, DeskOverview } from '../../../../contracts/automation.ts';

export const tools: readonly AutomationTool[] = [
  { key: 'setup-audit', name: 'Setup audit', command: 'npm run setup:audit', mode: 'deterministic', effect: 'read-only', availability: 'cli', description: 'Checks governance, shared builds, contracts, tool wiring and package versions before build.' },
  { key: 'github-audit', name: 'GitHub helper audit', command: 'npm run github:audit', mode: 'deterministic', effect: 'read-only', availability: 'cli', description: 'Reviews this repository and previews a commit subject without publishing.' },
  { key: 'version-check', name: 'Version check', command: 'npm run check:versions', mode: 'deterministic', effect: 'read-only', availability: 'cli', description: 'Checks package, lockfile and changelog consistency.' },
  { key: 'version-preview', name: 'Version bump preview', command: 'npm run version:preview -- --no-database-update', mode: 'deterministic', effect: 'read-only', availability: 'cli', description: 'Previews the next patch without changing files.' },
  { key: 'version-bump', name: 'Version bump', command: 'npm run version:bump -- --title "Release title" --no-database-update', mode: 'deterministic', effect: 'local-write', availability: 'cli', description: 'Explicit operator command; review the title and database-change choice first.' },
  { key: 'verify', name: 'Verify application', command: 'npm run verify', mode: 'deterministic', effect: 'local-write', availability: 'cli', description: 'Runs typecheck, audited build, tests and version checks; writes build output.' },
];

export function overview(environment: NodeJS.ProcessEnv = process.env): DeskOverview {
  return { tools: tools.length, phase: 'local-audit-queue', setup: {
    database: environment.AUTOMATION_DATABASE_URL ? 'configured-unverified' : 'not-configured',
    redis: environment.AUTOMATION_REDIS_URL ? 'configured-unverified' : 'not-configured',
    aiRequired: false, execution: 'local-postgres',
  } };
}
