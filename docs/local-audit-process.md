# Local audit jobs: operating process

## Scope and audit findings

The original 1.0.1 desk displayed tool descriptions but had no persistence or queue. This implementation adds a local PostgreSQL queue and immutable run/step results for fixed read-only audits. No AI or Redis is required. This is a local operator feature, not a multi-user production workflow platform, arbitrary shell runner or governed MCP execution system.

Automation owns its audit-run domain and PostgreSQL schema. Execution owns the reusable bounded Node process adapter. CodeShip owns fixed development database provisioning and encrypted install inventory. The shared infrastructure container, bindings, accounts for other products and data were preserved.

## Setup, once

1. Install/build shared framework and UI in their owners, then install this app independently. The reviewed Execution artifact is included under vendor and exposes compiled JavaScript and declaration files. Its ownership and digest are recorded in vendor/README.md; do not copy or fork its implementation into app source.
2. CodeShip's `node --env-file-if-exists=.env scripts/prepare-automation-database.ts` previews the fixed target. The same command with `--apply` creates `automation_local`, `automation_local_test` and a dedicated non-superuser role on the existing PostgreSQL container. It saves an encrypted recovery credential in CodeShip and materializes the app's ignored `.env`. It refuses existing inventory/databases/role and never rotates or drops them. A partial failure requires inspection of its recovery reference, not a blind rerun.
3. In Automation run `npm install`, `npm run db:status`, then explicitly `npm run db:migrate`. Run `npm run verify` and `npm run test:database`. No seeds or migrations run at API/worker startup. Both test and app connections must use local PostgreSQL; database tests additionally require a dedicated `_test` database and `NODE_ENV=test` (the test script supplies the latter).
4. Start API/web with `npm run dev:api` and `npm run dev:web` in separate terminals (4395/4390), or use the built desk with `npm start` on 4395. Use only one API process for this app. Start `npm run worker` separately. Queue storage alone does not start a worker.

The local role owns only these two new databases and has no superuser/create-role/create-database privileges. It is a development schema owner; a production migration/runtime role split remains required. Real credentials must never appear in docs, command arguments, job rows, model context or ordinary logs. `.env`, `node_modules`, build output and logs remain ignored.

## Run variants and steps

| Variant | Ordered steps | Expected result |
| --- | --- | --- |
| quick | Setup audit → package/lockfile/changelog version check | Green only when both processes exit zero and completion is committed |
| quality | Setup audit → version check → TypeScript check | Green only when all three pass |
| failure-probe | Fixed diagnostic script exits 1 | Deliberately red; verifies failure capture and prevents false green |

Use Run history's app-header Quick audit / Quality audit / Failure probe actions. Successful enqueue navigates to its persisted run reference. Refresh or reopen `/runs/{publicId}` to inspect ordered step reasons and timings. The list shows the latest 100 runs; Queue shows full stored state counts. The shared list filters supplied rows locally, not the entire database. Polling refreshes every three seconds; errors are shown instead of treating stale results as current success.

CLI equivalents, from this app:

```text
npm run jobs:enqueue -- quick
npm run jobs:work
npm run jobs:history
npm run jobs:queue
```

`jobs:work` processes at most one job and exits nonzero when that job fails. `worker` continues polling the durable queue every two seconds while idle. Its Ctrl+C/SIGTERM handler drains the current audit before stopping. A pending job can be cancelled from its detail page. Running work is not forcibly cancelled; each step has a 30-second timeout, and a run has at most three steps. Starting another audit creates another historical run, never rewrites a previous failure.

## State and recovery

Persist pending before acknowledging acceptance. The worker uses a short PostgreSQL claim transaction, an advisory lock and `FOR UPDATE SKIP LOCKED`; it checks for an active local job before claiming another. No transaction stays open while scripts run. Duplicate API submissions using the same idempotency key reuse the same run; changing the variant with that key returns a conflict. Actor and tenant come from the fixed local operator boundary, not the request payload.

Store steps in sequence and stop at the first failed step. A final green state is committed only after all steps pass. Raw child stdout/stderr is discarded; persisted reasons are allowlisted classifications, not copied sensitive logs. A completed run retains start/finish time, queue wait and execution duration. Partial steps remain visible if completion storage fails.

Worker death leaves a running record. After its five-minute lease expires, the next worker marks it interrupted, without automatically re-executing it. A database outage blocks new acceptance and claims. An already-started read-only script can finish while storage is unavailable; it never becomes green without a successful completion write. Inspect history and rerun explicitly after recovery. No external effects or automatic retries are supported by these audit variants.

The audit assumes repository code is trusted; process execution is not a security sandbox. It passes a small OS environment without app database/AI credentials, uses a Node executable and fixed script paths, applies time/output limits and rejects paths escaping the repository. Version mutation, GitHub publication and arbitrary shell commands are excluded from queue variants. Existing version/GitHub helpers remain explicit operator CLI tools.

## Schema and history

Business module `audit-run` owns `audit_runs` and `audit_steps`; migrations are in that module's database folder. Kysely composes one ordered migration history. There is no demo or required seed data. Runs have standard public IDs and trusted actor/tenant fields. Step rows are a documented technical child-table exception: composite `(run_id, position)` key, append-only result lifecycle, parent-owned scope, no artificial active/public ID fields. Deletion, pruning and automatic retention are not exposed; choose a retention policy before long-term production use.

Definitions currently comprise fixed code-owned variants. Preserve their semantics for historical interpretation; publish a new versioned definition contract before configurable workflows. API requests cannot supply commands, paths, actor IDs or tenant scope. Only loopback/same-origin reads and writes are supported. These guards do not authenticate individual people on a shared machine and do not implement production tenancy or MCP approvals.

## Performance and acceptance

Pool size is four, worker concurrency is one, idle polling is two seconds, step timeout is 30 seconds and output is capped at 256 KiB. Queue-state/created-time indexing supports claims; history reads are bounded to 100. This favors predictable local auditing rather than high-throughput workload processing.

Measured development samples on 2026-11-18: quick audit 242 ms (setup 75 ms, versions 83 ms); successful quality audit 780 ms (setup 90 ms, versions 68 ms, typecheck 480 ms); intentional failure probe 148 ms. Run duration includes database writes between steps. Queue wait was 717–1142 ms for manually invoked samples; it is distinct from execution time and includes worker startup/waiting. These are individual observed samples, not throughput, percentile, production capacity or regression guarantees. Use stored timings across repeated runs before tuning concurrency.

Verified database tests cover concurrent idempotent submissions, conflicting request-key reuse, single-active claims, persisted green/red results, pending cancellation, expired-lease interruption, arbitrary-command denial and remote-peer denial. The disposable database test deletes only the rows it creates. Execution adapter tests cover success, nonzero exit and timeout. Full acceptance also requires build, API readiness and browser run/reload checks recorded in the work record.

Known limitations: inherited build-tool dependency findings remain unresolved; migrations and production authentication need release review; Redis/BullMQ, scheduling, AI, remote repositories, arbitrary workflows and active-job cancellation are not implemented. Readiness verifies the audit table is queryable; Queue counts do not certify a live worker heartbeat. Failed diagnostics remain red even when newer quality audits pass.

Technical reference: PostgreSQL documents [SKIP LOCKED for queue-like consumers](https://www.postgresql.org/docs/current/sql-select.html). This application's concurrency and recovery behavior also depends on its explicit transaction/state logic; locking alone does not guarantee it.
