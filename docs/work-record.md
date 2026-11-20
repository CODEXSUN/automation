# Work Record

## 2026-11-18 — managed worker and human review release preparation

- Implemented actor-preserving queued authorization: verified Platform tenant/user/session references are stored privately at enqueue; worker rechecks the current Platform service/session/app/permission decision before every read-only step. Failed authority records an explicit terminal reason rather than leaving a claimed job running.
- Added Execution 0.2.0's Redis/BullMQ delivery adapter, durable PostgreSQL pending reconciliation, managed API/worker supervisor and worker/Redis heartbeat readiness. CodeShip prepares a separate persistent namespaced Redis account and private network attachment with encrypted recovery settings before effects. No administrator Redis credential is passed to Automation.
- Added additive migration 20261118000200_worker_reviews, creator/outcome/review evidence, Review inbox, append-only reviewer decisions and live Queue health. Human review does not modify job status or confer execution authority. Existing runs, steps and published migrations are preserved.
- Fixed the runtime Git fixture prerequisite in the immutable Dockerfile. Tagged Automation CI now runs the actual PostgreSQL and BullMQ suites against disposable services.
- Preparation checks passed: audited build/typecheck, eleven app/tool/authorization tests and both real PostgreSQL/BullMQ integration suites. Platform's focused isolated patch passed thirty tests plus all five existing PostgreSQL regression suites; unrelated pending Platform edits are untouched. Tagged Platform v-1.0.6 workflow succeeded. Deployment/browser results are recorded only after installation.
- Release candidate Automation 1.0.5 uses the reviewed Execution 0.2.0 archive; archive integrity matches the lockfile. Existing inherited dependency-audit findings are not represented as resolved by functional tests.

## 2026-11-18 — deployed Docker verification

- Verified the already deployed Automation 1.0.4 image/revision through CodeShip's managed verifier; container healthy on loopback 4459, PostgreSQL role/data scope queryable and non-superuser/non-BYPASSRLS, schema current. Protected APIs rejected anonymous requests. No rollout or deployed migration performed.
- Native ten-test suite passed; deployed suite passed nine of ten, with the GitHub-helper fixture failing because the runtime image lacks Git. Deployed typecheck/setup/version checks passed. Original native test connection timed out; the dedicated PostgreSQL integration suite then passed from the deployed image against the separate test database over a temporary private test bridge.
- Added three deliberate retained deployed-history diagnostics: quick v7raeu3m passed (364 ms), quality 92j59tev passed (1900 ms), failure-probe f2i4093a correctly failed with exit-nonzero. Final deployed counts: six succeeded, three failed, no pending/running jobs. These were manual jobs:work checks, not evidence of an automatic worker.
- Redis authenticated PING, AOF/noeviction inspection and isolated enqueue/dequeue smoke passed using saved CodeShip secrets without printing them. Automation has no Redis URL or BullMQ adapter, and its container/network has no Redis integration. No persistent worker process is deployed.
- Reproduced a Platform-actor worker rejection in the dedicated test database: API-style creator differs from the worker's fixed local actor, leaving running with zero executed steps. Removed only that synthetic diagnostic record afterward. This prevents an all-green Platform-to-worker claim and needs a governed implementation/release task.
- Detailed evidence, test isolation and remaining findings are in docs/docker-verification-2026-11-18.md. No shared services/images/credentials or existing records were altered; only intended diagnostic history was added. Documentation remains local and unpublished.

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
- [x] Establish dedicated PostgreSQL runtime credentials and authenticated Redis readiness through CodeShip.
- [x] Implement trusted Platform identity, durable audit runs/reviews and Execution-owned BullMQ delivery.

## Decisions and open questions

- Uses the shared default design system and shared server framework.
- Module routing must follow the central Routes and navigation guide: internal `/api/v1` calls, clean browser paths, `/api/docs`, and URL/history state restoration. These are instructions until implemented and verified.
- The audit workflow now uses PostgreSQL, Platform authorization and managed Redis/BullMQ. Arbitrary workflow authoring and AI dispatch are outside this delivered phase.
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

## 2026-11-18 — recovery/review hardening

- Candidate 1.0.5 passed its tagged image workflow. Before installation, hardened idle-queue interrupted-run recovery and guarded unsaved review navigation; these source changes use fresh release 1.0.6 rather than reusing a tag. Both releases include the same additive worker/review migration; no deployed data has been migrated by source publication.

## 2026-11-18 — managed Docker worker and human review verified

- CodeShip installed Automation 1.0.6 after coordinated Platform recovery. Checked backup, additive migration, scoped Redis, worker readiness and Platform admission passed. Eleven installed-image tests and both real PostgreSQL/BullMQ suites passed. Targeted Redis access loss/recovery and app restart passed; nine existing run IDs were retained.
- The user's signed-in browser completed quality run `28zn2i9m` and intentional failed probe `hvm8pels`. Accepted/Needs attention decisions persisted, retained execution state and left the review inbox. Unsaved navigation protection was verified. No password, access grant or database reset was used.
- Final browser audit identified two audit actions that still permitted enqueue with an unsaved note. Corrected both consistently in fresh candidate 1.0.7, without changing schema or worker contracts. See `docker-worker-verification-2026-11-18.md` for timings, procedure and honest test limits. Tagged CI and image-only rollout remain separate checks for that candidate.

- Final state: 1.0.7 tagged CI succeeded and CodeShip installed the approved image at 17:47:15 UTC. No migration was pending; readiness/admission passed. Browser verified all three unsaved-note action guards and retained review evidence. The final installed-image repeat is blocked by another app's exclusive deployment lock; no repeat test or lock release is claimed. Earlier 1.0.6 Docker suites and 1.0.7 CI passed. No active Automation operation or lock waiter remains.


### 2026-11-18 local Docker port contract

Compose now declares `127.0.0.1:14395:4395`. Compose configuration validated without starting containers. Runtime rollout belongs to this app's chat using CodeShip and an approved release; this contract edit does not certify a changed running listener. Preserve private relays, credentials and data.

## 2026-11-19 — supervised fairness and recovery audit

- Candidate1.0.8 bounds audit HTTP acceptance to4 active DB calls/1 per requester, pending work to100/installation and8/requester, and orders dispatch by least recently served requester. Duplicate replay still resolves at capacity; foreign tenant references stay hidden. Added only ordered requester-dispatch index migration; published migrations remain unchanged.
- Consumes published framework0.2.0/UI0.1.12/SDK0.1.5 pins and immutable Execution0.2.1 vendor artifact. Known read-only PostgreSQL startup failures retry with the shared helper; idle pool socket loss does not crash API/worker. Redis reference batches, producer deadline, reconnect delay and business starts are bounded; business results stay in PG.
- Local complete verify passed (13 tests, build2.37s); real dedicated-PG baseline,125-request HTTP overload/capacity/fairness/tenant/collision fixture and startup/idle-loss recovery passed through ephemeral test-only byte relays. One bounded idempotent fixture transport retry was recorded. No native process, scheduler, live business row, service or Docker deployment was changed. Later shared-folder rerun hit the owner's missing Fastify/avvio install; no sibling repair attempted.
- Browser connections are unavailable; new app-specific viewport measurements remain a CodeShip/supervisor check. Shared UI owner supplied independent viewport evidence. Full results, exact files, pending hosted Redis checks and deployment prerequisites are in `supervisor-audit-20261119.md`. CodeShip alone owns actual migration/replacement and14395:4395 verification.

- Final source/release handoff: v-1.0.8 `d0bd54c42142a373051c85f62a4cf5c75e45e37d`, hosted workflow44434505621 succeeded;13 unit/auth/tool tests and5 real PG/BullMQ integration tests passed. Overload125 HTTP requests produced1 accepted/124 controlled429, global queue100, zero hosted transport retries; PG startup recovered in2 attempts/372ms and the Redis outage fixture retained/completed2 jobs. Immutable image digest `sha256:54163c3441276695cf618accd9467e712e5fdab57678e8de778d1b4d4c9226e0`; release manifest exists. Report status is release-ready for CodeShip, not deployed. No owner-side deployment, grant/password change or native scheduler restart.

## 2026-11-19 — latest local Docker deployment audited

- The user requested current governance/CodeShip reference review and latest local deployment. GitHub latest is still1.0.8; CodeShip had already installed that exact approved image successfully at01:47:10UTC with backup, additive migration and Platform admission. Its separate backup restore rehearsal matched all11 public history identities. Current14395:4395 binding and image match, old4459 closed; no redundant replacement was performed.
- Current read-only checks passed for frontend/liveness/readiness200, anonymous API401, foreign Origin403, released CodeShip independent-network validator, fresh metrics, worker heartbeat, Redis connectivity, fairness index and11 existing runs. Browser sign-in page rendered. The write-recording verifier could not acquire another app's lock; no lock was removed and no new managed verification stage is claimed.
- Full evidence and references: `docs/deployments/local-automation-1.0.8.md`. No production record, password/grant, native process/scheduler, infrastructure service or sibling app was changed. Authenticated viewport/business checks remain separate from this operational audit.

## 2026-11-19 — loaded dashboard verification and route wrapper

- Signed-in Overview/Queue/history/review detail all loaded at360/768/1920,12 checks, no document overflow or browser errors;11 retained history records. Test login signed out and remained revoked on reload. Released CodeShip selected verify passed02:58:09UTC and released the lock.
- Measurement found all-page use of governed90% list wrapper also inset dashboards. Candidate1.0.9 applies existing full-width padded pattern to Overview/Queue while preserving list/detail alignment. No shared CSS change or new migration. Isolated source excludes canonical concurrent Zetro sidecar edits; approved pins remain unchanged. Actual candidate test/release/deployment evidence follows in supervisor report.

## 2026-11-20 — App launcher and tab sessions

Prepared v-1.0.10 from the published v-1.0.9 baseline. The workspace launcher uses the authenticated Platform catalogue; UI 0.1.19 and SDK 0.1.11 are pinned for launcher and tab-session behavior. No database migration or access grant is included. Exact-pinned typecheck, production build, all 13 unit/tool tests and version checks passed. Local Docker and cross-app live verification remain pending.

## 2026-11-20 — Authenticated launcher catalogue

Prepared v-1.0.11 with SDK 0.1.12. Exact-pinned typecheck and production build passed; all unit and tool tests passed. The preceding release remains retained and is not the launcher rollout target. No migration or access grant is included. Local Docker and cross-app live verification remain pending.
