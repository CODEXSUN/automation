# Work Record

## 2026-11-18 — version 1.0.2 source publication preparation

- User authorized version 1.0.2, log update, audit, commit and push of Automation to the configured CODEXSUN/automation main branch. Remote synchronization found no incoming or outgoing commits before preparation.
- Bumped package/lockfile/changelog with the app version tool, declaring the new audit-run migration as a database change. Updated API specification version and completed the release notes without changing historical published entries.
- Audited the new Execution dependency: initial source-only packaging failed Node's installed-package TypeScript restriction. Corrected it in the source owner, compiled the public adapter, packaged only JavaScript/declarations/metadata/README and installed the reviewed artifact under vendor. Its SHA-256 and ownership are recorded in vendor/README.md. No sibling repository is included in this source push.
- Adopted the current scoped GitHub helper from governance. Publication uses the explicitly reviewed index; no implicit stage-all, rebase, forced push, version bump or deployment is part of that helper operation.
- Final checks passed after the packaging fix: full typecheck/prebuild audit/build/eight app tests/version consistency and the real dedicated PostgreSQL integration suite using the installed artifact. Database status confirmed the existing local migration applied; publication did not rerun app migrations or alter retained history.
- npm audit still reports four high inherited build-chain findings and no critical findings. These remain disclosed; functional green checks are not a clean dependency-security certification. .env, database credentials, local records, logs, node_modules and build output are excluded from the source commit.
- This prepares source publication only. It creates no Git tag, deployable image or runtime rollout; pinned container-release contracts and production identity remain outside this task. Push outcome is verified separately against remote main after publication.

## 2026-11-18 — local database audit queue

- Audited 1.0.1: existing desk had no durable jobs, worker or history. Added local PostgreSQL run/step records, explicit Kysely migration, idempotent queue acceptance, one-active-job claims, pending cancellation, expired-lease interruption and a separate draining worker.
- Added quick/quality/failure-probe variants, fixed script allowlisting, sanitized result classifications, per-step/run durations and queue wait. Added shared Run history/detail and Queue pages with real API binding; raw command output and credentials are not persisted. No arbitrary shell, version mutation, publishing, AI, Redis/BullMQ or external effects are enabled by queue jobs.
- CodeShip's fixed preparation script created only new automation_local/automation_local_test databases and a dedicated non-superuser role on the existing PostgreSQL service; encrypted credentials were registered before provisioning and materialized into ignored app .env. Successful app migrations and actual queue operations verified authenticated connectivity. Existing service images, bindings, volumes and other application data were unchanged.
- Shared Execution now supplies bounded shell-free Node process execution. Its package/lockfile and test remain owner-local. App database state remains Automation-owned.
- Verification: full app typecheck/audited build/eight existing tests/version consistency passed; dedicated PostgreSQL integration test passed including concurrent duplicate requests, conflict detection, single-active claims, green/red persistence, cancellation, interruption and API guard checks. Execution adapter success/nonzero/timeout test passed. Database tests clean only their own rows in the dedicated *_test database.
- Actual history retained: quick audit passed in 242 ms; early quality audit failed on a real type error and remains red; after correction quality audit passed in 780 ms. Intentional failure-probe remained failed in 148 ms. Browser-created quality run p16eryof passed in 868 ms (setup 98, versions 71, typecheck 490 ms), with 1121 ms queue wait; direct browser reload retained all results. These are samples, not throughput guarantees.
- Local API and worker started separately. Current schema/readiness and run APIs were verified. No live worker heartbeat or production/multi-user identity is claimed; fixed local guards do not identify individual people. No forced active-job cancellation, automatic retries, retention pruning or arbitrary workflow designer is implemented.
- Clean setup/run/recovery/performance instructions are in docs/local-audit-process.md. This work remains local and is not a new release, commit, push or deployment. Existing build-chain dependency findings remain unresolved.

## 2026-11-18 — version 1.0.1 publication preparation

- User authorized connecting only Automation to https://github.com/CODEXSUN/automation.git, setting version 1.0.1, logging changes, committing and pushing.
- Connected origin and preserved its existing main commit, README purpose and ignore rules. Package, lockfile and changelog now agree at 1.0.1; the explicit version selection supersedes the ordinary next-patch increment.
- Full verification passed: typecheck, prebuild setup audit, frontend build, eight tests and version consistency. Existing dependency-audit findings remain documented below.
- Scope is source publication only: no deployment, database operation, sibling publication or tagged image release. This app still has no verified pinned container-release contract. Commit/push outcome is verified separately after publication; this entry records preparation, not a deployment claim.

## Goal

Independent deterministic automation with optional Zetro AI integration

## Completed

- Created the starting folders, governance instructions, shared package references, environment examples, and startup files.
- Generated-file audit recorded in `docs/creation.json`.

## Next

- [x] Deliver the independent setup/tool desk without an AI dependency.
- [x] Install owner-local dependencies and build against existing shared framework/UI artifacts.
- [x] Verify process health, real catalog APIs, documentation, overview, catalog search and direct reload.
- [ ] Establish dedicated PostgreSQL runtime credentials and authenticated Redis readiness through Codeship.
- [ ] Implement trusted identity, persistent workflow/run/outbox modules and Execution-owned queue adapters.

## Decisions and open questions

- Uses the shared default design system and shared server framework.
- Module routing must follow the central Routes and navigation guide: internal `/api/v1` calls, clean browser paths, `/api/docs`, and URL/history state restoration. These are instructions until implemented and verified.
- Database, authentication, deployment, and business features are not configured.
- Generated files are not proof that installation or runtime checks passed.

## Daily work

| Date | Request or goal | Completed | Next or blocked | Verification |
| --- | --- | --- | --- | --- |

## 2026-11-18 — phase one completed

- Created independent Git repository at apps/automation with ports 4390/4395; no commit, remote or publishing performed. Existing shared changes were preserved.
- Added shared UIUX overview and read-only Automations catalog, local peer/Host/Origin guarded APIs, API docs, public setup/step/dispatch contracts, CLI tool inventory and automatic prebuild setup audit. No AI credentials are needed. Mutable workflows are deliberately not included in this setup phase.
- Installed dependencies locally. Typecheck/build/version checks passed; eight tests passed, including denied remote/cross-origin access, absent browser execution, secret-free setup responses and fail-closed governance audit. Preflight passed before startup. GitHub audit and version bump preview succeeded without mutation.
- Started built server on loopback 4395. Live/ready, overview/catalog, API docs and direct catalog HTML all returned 200. Browser verified overview, six catalog rows, search and direct reload. Framework readiness currently has no PostgreSQL/Redis dependency callbacks; it does not certify those services. Shared theme behavior was inherited, not separately retested.
- PostgreSQL Docker health and in-container SQL version query passed (17.12); Redis returned NOAUTH to unauthenticated PING on the reachable loopback service. App-level authentication/connectivity and queue compatibility remain unverified. No service, database, credentials, volumes or ACLs changed.
- npm audit reports four high findings in one inherited picomatch → fdir/tinyglobby/Vite dependency chain. Registry latest picomatch is 4.0.7, within the reported advisory range. No force downgrade or unrelated shared upgrade performed. This is an unresolved dependency limitation, not a clean security audit.
- Workspace port audit includes both new pairs but reports an existing Ecommerce missing dev:api/dev:web command issue. That unrelated app was preserved.
- Next: dedicated app connection provisioning/verification, trusted actor scope and one durable deterministic workflow slice. Zetro remains an optional separate provider app. Relocated standalone tarball installation and live queue execution are not verified.

## 2026-11-18 — Coordinated tagged deployment contract

- Added the common .container build/Compose/delegation contract and pinned tagged release workflow. Shared SDK 0.1.2 is pinned to published commit 5f9f7b73ec8c01df698f2914676e83e9b1668d91; governance is available in the isolated CI source for setup audits. No local environment, database or credentials enter the build context.
- Source verification and runtime/database adapter audit are recorded separately by CodeShip. Contract generation alone does not install, migrate or certify a deployment.

## 2026-11-18 — Suite Platform authentication gate

- Connected/reviewed automation through the shared Platform browser/session and one-use service-grant pattern. Preserved business records, existing module work and concurrent release/UI changes. See Platform's auth-gate-rollout.md and this app's platform-auth.md for the exact data scope and limits.
- Owning typecheck/build/tests/version checks passed. Native default-account login, tenant session, required password enforcement and logout were verified for newly connected apps; Texlinks' existing real verification was retained and its disposable two-tenant suite rerun. No real password change or database reset.
- Core/Billing/Ecommerce/Automation preserve explicit Codexsun database bindings; Zetro uses its dedicated PostgreSQL/RLS boundary; CRM/HRMS/Texlinks do not claim implemented business data. Local app settings stay ignored. Production/deployment and fuller account lifecycle remain separate work.

## 2026-11-18 — Audited source release handoff

- Source typecheck/build and app/tool checks passed for the coordinated release, with restricted Docker database targets tested where needed. Dependency commits are published immutable versions. The user authorized including current app changes after audit.
- Tagged workflow success, database copy/migration planning, runtime checks and Platform admission remain separate CodeShip stages; source publication alone does not certify deployment.

## 2026-11-18 — Audited source release handoff

- Source typecheck/build and app/tool checks passed for the coordinated release, with restricted Docker database targets tested where needed. Dependency commits are published immutable versions. The user authorized including current app changes after audit.
- Tagged workflow success, database copy/migration planning, runtime checks and Platform admission remain separate CodeShip stages; source publication alone does not certify deployment.
