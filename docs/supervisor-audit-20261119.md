# Automation supervisor audit — 2026-11-19

Status: done —1.0.9 published, deployed and verified with loaded signed-in360/768/1920 pages. Both original verification gaps and the narrow dashboard-wrapper correction are complete. App owners execute selected deployments through shared CodeShip tooling and the exclusive lock.

## Baseline and findings

- Source app 1.0.7. Existing unrelated `.container/compose.yml` and work-record port handoff edits are preserved.
- PostgreSQL enqueue currently accepts an unlimited pending backlog. Global FIFO permits one requester's burst to occupy all delivery slots; no per-requester capacity policy exists.
- Execution uses an API process and separate BullMQ worker. Redis carries references only; per-step authorization stays with Platform. No browser worker-execution HTTP endpoint is added.
- Redis producer commands lack an explicit command timeout. Startup and shutdown behavior need fixture-based outage/recovery checks.
- Migration files are module-owned and published names must remain unchanged. Any queue index is a new ordered additive migration, never a rewrite.
- Shared framework startup and shared UI responsive/auth recovery belong to their owners. Release pins will consume published commits only.

## Planned scoped checks

Disposable 100+ concurrent acceptance, idempotent replay at capacity, requester fairness, tenant-bound authorization denial, startup PG/Redis failure and recovery, queue bounds, API/worker separation and responsive app-owned content. Results/timings, exact files and immutable release identity will replace planned claims as checks complete. Native schedulers and business records remain untouched.

## Focused progress

- App typecheck passed. All13 app/tool/auth tests passed in0.90s, including a125-request admission fixture: at most4 DB acceptance callbacks and1 per requester, with429 on excess and capacity release after failure. Execution build and4 tests passed (9.12s including process fixtures).
- Implemented transactional pending limits100/installation and8/requester, idempotent replay before capacity checking, least-recently-dispatched requester ordering and out-of-order reference rejection. Queue health now fetches only its latest row rather than loading100 review-enriched rows.
- API and worker consume the published framework read-only startup helper; only known transport/recovery codes retry. Missing schema, credentials or permissions remain fatal. Idle PostgreSQL client error events no longer crash the process; queries/readiness still report unavailable.
- Producer delivery now batches at most100 references with a2s command timeout, capped4s reconnect backoff and one business start attempt. No auto-repeat of stalled business execution.
- Native loopback test database timed out. Using only ephemeral `docker exec` byte relays in the existing Automation container (no image, mount, runtime file, restart or service changes), the dedicated `_test` PostgreSQL baseline suite passed in6.60s. Initial direct-repository overload fixtures exposed pool-queue timeout under that slow relay; the fixture now drives125 actual HTTP requests through the real admission path, separately checks bounded idempotent transport retries and tests the final global-capacity race. Final results are still running, not yet claimed.
- App-owned Tailwind discovery is bounded to `src/web`; main content is full-width/min-width-zero, header actions wrap and long review notes wrap. Shared UI recovery/responsiveness consumes published0.1.12; actual new app viewport checks remain pending.
- Immutable pins selected: framework0.2.0 `51daaa2a7bee32d0a8eca806a2b0e8a765a3e1ac`; UI0.1.12 `e88945f101313051ded3557e14b0363a0a6ca906`; SDK0.1.5 `8bd3a9ed00b505a3ee0bf28ce9fc531d880b3e99`. Shared framework hosted CI passed per supervisor; owner publication is separate from app CI.

## Execution foundation

`foundation/execution` is an unborn standalone repository with an existing 0.2.0 source tree. Automation currently vendors its built package. Its existing files must not be discarded or treated as published. Source changes and artifact digest/version will be reported separately; no dirty shared branch will be pinned.

Final artifact: Execution0.2.1, SHA-256 `2e47e09937e7807e141d5493fd009c9a04ddcc0742409b151edbc4a2cccf1f8d`. Final source build and four tests passed in1.96s. The callback's business result is deliberately not returned into Redis metadata. Exact binary integrity matches the lock and installed package. See the foundation's own `docs/supervisor-audit-20261119.md`; standalone source Git publication remains unavailable because no remote/initial commit is configured. No remote or registry identity was invented.

## Actual completed verification

| Check | Result / measured time |
| --- | --- |
| App typecheck, setup audit, build, tests, versions | `npm run verify` passed;13 tests in1.58s; final bounded-source Vite build2.37s (earlier6.74s) |
|125 in-flight admission callbacks | Passed; four active at most, one per requester, excess429 and slots released after failure |
| Real PostgreSQL original regression suite | Passed through ephemeral test-only byte relay;13.05s final run |
|125 simultaneous HTTP acceptance requests | Passed against real dedicated PG:1 accepted,124 controlled429; no unbounded DB wait queue |
| Requester/global capacity and fairness | Passed;8/requester,100 pending, eight-way final capacity race admits4/rejects4, idempotent replay available at capacity, stale Redis order cannot bypass next fair requester |
| Public-ID collision and tenant hiding | Passed: five bounded public-ID collisions without aborted-transaction reuse; foreign-tenant fixture hidden from detail/cancel/review |
| Combined overload/capacity fixture | Passed41.18s over slow Docker-exec byte transport; one bounded idempotent transport retry,103 disposable fixture records cleaned |
| Real PG startup/idle socket recovery | Passed: two startup attempts,697ms recovery sequence; test929ms, process remained alive |
| Execution source tests |4 passed,1.96s;125-reference cap, PG/Redis callback recovery, invalid-reference/publication failure, bounded shell-free process outcomes |
| Real Redis/BullMQ transport-outage fixture | Tagged clean CI passed: two PG jobs retained during Redis startup/outage and automatically completed after recovery; entire fixture8.18s, measured recovery sequence6.11s |
| App browser viewport measurements | Unavailable: browser inventory empty; IAB and Chrome creation both report unavailable. Shared UI owner separately verified360/768/1440 and larger widths; that is not a new app-specific measurement |

The native5433 test path timed out. Ephemeral read-only `docker exec` byte relays used the existing Automation container's private PostgreSQL network only; no runtime file, image, mount, shared service, registry, native process or deployment changed. All SQL fixtures used the pre-existing dedicated `_test` database and cleaned their own IDs. Initial fixture attempts are not hidden: bypassing HTTP admission with125 raw repository calls hit pool transport timeouts; the final HTTP fixture tests the actual bounded entry path and separately bounds idempotent fixture transport retries.

A later shared-folder unit rerun could not import `avvio` from `foundation/framework/node_modules` (then Fastify itself became absent). Earlier complete verification and real PG checks passed. No sibling dependency installation was repaired by this owner; immutable tagged CI builds fresh pinned dependencies and is the release gate.

The framework owner subsequently restored its own lockfile installation without source/version changes. Read-only app typecheck,13 tests (1.10s) and version checks passed again. The removal's cause was not established or attributed to another worker. No installer was run in shared sibling folders by this owner.

## Exact owner files

- Admission/contracts/API: `contracts/run.ts`, `src/api/modules/business/audit-run/{admission,repository,routes}.ts`, `src/api/modules/automation/routes.ts` (public version metadata), `src/api/database/{connection,startup,migrations}.ts`, `src/api/server.ts`, `scripts/{worker.ts,test-database.mjs}`. Existing `src/api/app.ts` identity/error gates are unchanged.
- New schema file only: `src/api/modules/business/audit-run/database/migrations/20261119000100_queue_fairness.ts`. Both published20261118 migration files remain unchanged.
- UI/build: `src/styles/index.css`, `src/web/modules/home/page.tsx`, `src/web/modules/queue/page.tsx`, `src/web/modules/runs/{page.tsx,services.ts}`. Main content uses available width; actions/long notes wrap; auth remains the public shared gate.
- Fixtures: `tests/{database-startup,enqueue-admission}.test.ts`, `tests/database/{audit-run,queue-fairness,recovery}.test.ts`. Existing BullMQ actor/denial/review suite stays enabled in CI.
- Release/docs: package/lock, `.container/release.json`, preserved CodeShip `.container/compose.yml` port contract, version/changelog/release/work records, this report, vendor README and exact0.2.1 archive. No shared sibling-owned source file was edited except the explicitly assigned Execution owner.

## Migration, data and CodeShip handoff

- New ordered additive migration creates only `audit_runs_requester_dispatch(tenant_id,created_by,started_at)`. No row backfill, rename, delete, reset, seed or rewrite. CodeShip must quiesce writers, retain/check its normal PostgreSQL backup, inspect migration ordering/checksums, then explicitly migrate. An index can lock a populated table while built; perform during the quiesced update and retain the prior image/backup. No automatic downgrade is proposed.
- Fixed per-installation tenant binding remains authoritative. Trusted Platform requester/session references are rechecked before each read-only step; worker decisions and service credentials do not move to the browser. Existing users, grants, jobs, public links and native schedulers remain intact.
- Preserve the pre-existing authorized port contract14395:4395. The API stays on its private loopback4395 listener. CodeShip must supply/verify the actual private-IP4395 ingress, retain existing private relay/Host/Origin/grant checks and update its Docker registry/browser origins/probes. Retire old4459 only after verified replacement. This source report does not claim that mapping is already live.
- CodeShip is the sole deployer: prepare the exact successful app tag/release manifest, run the serialized owning update under its lock, then verify image identity, PG/Redis/worker readiness, login/permissions, history preservation, frontend viewport/long-note behavior, actual14395:4395 binding and old binding retirement. Do not restart the whole shared stack for this app's checks.
- Runtime workspace baseline179–327ms was provided by supervisor. No new deployed workspace or100-user production soak timing is claimed. Fixture overload/recovery times above include the deliberately slow local test transport; they are not production latency promises.

## Handoff

Version1.0.8 / tag `v-1.0.8` published through the audited GitHub helper, exact commit `d0bd54c42142a373051c85f62a4cf5c75e45e37d`. [Tagged workflow44434505621](https://github.com/CODEXSUN/automation/actions/runs/44434505621) **succeeded**. [Release manifest](https://github.com/CODEXSUN/automation/releases/download/v-1.0.8/release-manifest.json) exists. Approved immutable image and image ID: `ghcr.io/codexsun/automation@sha256:54163c3441276695cf618accd9467e712e5fdab57678e8de778d1b4d4c9226e0` / `sha256:54163c3441276695cf618accd9467e712e5fdab57678e8de778d1b4d4c9226e0`. No production migration or image replacement was executed by this owner.

Clean hosted results:13 unit/tool/auth tests passed (0.887s), all5 real PostgreSQL/BullMQ integration tests passed (12.918s total), zero failures. Original database regression320ms; actor/denial/review BullMQ2165ms; overload fixture707ms (648ms measured work),125 HTTP requests→1 accepted/124 controlled429, exact100 pending bound and zero fixture transport retries; startup/idle recovery413ms (two attempts,372ms measured); Redis startup/outage recovery8181ms. Published image was built only after those checks passed. Local slow byte-relay timings above remain separate evidence, not substituted for hosted results.

Manifest migration hashes: original audit runs `f4d3d89e6c18267fb221ac277618e105abbee95b98aedb4a294efca8ee66833f`; original worker reviews `5b6e248b80e8b9e65dbd9f399e9d3ec0852d9ec1e7ccd7249229f5321c5590a5`; new fairness index `cc61504bd2157488cf9e127adb7f4df45fc8457b5f07015f0700a38bee3835c4`. Git comparison confirms only the new migration path changed; the published original files were not rewritten. CodeShip must independently match these against its applied target history before running the additive migration.

CodeShip can now prepare `automation@v-1.0.8` from this successful release and perform the separately owned serialized rollout/checks above. App-specific browser viewport measurements and actual14395 port retirement checks remain post-deployment acceptance items. Existing running-version identity is not changed by this handoff report.

`foundation/automation` scope audit is done/documentation-only: that owner has AGENTS.md and no executable package/schema/worker. Its report records why no duplicate shared engine/version/deployment is invented. Execution's separate report covers its built vendor artifact and explicit source-publication limit.

## Verified deployed state

On the user's later explicit deploy/audit request, GitHub latest remained1.0.8 and the CodeShip target state showed the exact approved image already installed successfully at2026-11-19T01:47:10UTC. CodeShip recorded checked backup/migration, Platform admission and preserved11 history identities, and later completed a separate actual backup restore rehearsal. Current operational checks passed at14395:4395;4459 is closed, readiness/frontend200, anonymous API401, foreign Origin403, released CodeShip network/identity validation passed, metrics fresh, worker/Redis ready, fairness index present and history count11. No redundant replacement was performed. See `deployments/local-automation-1.0.8.md` for references, exact evidence and the busy-lock limitation on appending a fresh managed verification stage. Authenticated dashboard viewport acceptance was not fabricated from the sign-in-page check.

## Supervisor status refresh — 2026-11-19

- Source HEAD observed before this documentation refresh: `cd090453a27908564ec6f6494c7a6925b1da576e` (deployment audit documentation). Released application code remains `d0bd54c42142a373051c85f62a4cf5c75e45e37d`, tag `v-1.0.8`, workflow44434505621 succeeded;13 app and5 real PG/BullMQ tests passed as detailed above.
- Current running version1.0.8 is still GitHub latest. Image ID/digest remains `sha256:54163c3441276695cf618accd9467e712e5fdab57678e8de778d1b4d4c9226e0`, healthy at14395:4395. Fresh readiness200 and anonymous history401 confirmed. No replacement or migration rerun needed.
- Concurrent uncommitted work is present in `src/web/modules/home/page.tsx`: a Zetro sidecar import and MainLayout assistant property. It is preserved, excluded from this publication, and not included in the deployed1.0.8 claim. Its dependency adoption/test/release belongs to the coordinated sidecar work; no unrelated SDK/UI integration was silently shipped.
- A fresh selected-app managed verify attempt through released CodeShip1.0.18 again refused another owner's operation lock. No lock was removed or bypassed, no waiter remains, and no sibling app/native process was stopped. The already recorded successful deployment and read-only audit stand.
- Remaining concrete verification gaps: a signed-in current dashboard session for app-specific viewport/business acceptance; an available exclusive lock to append a fresh managed verification stage. These are not a deployment failure or justification to replace the matching healthy image. Execution standalone Git publication remains unavailable because its repository has no agreed remote; its exact0.2.1 vendor artifact is already included and tested in the released app. The empty Automation foundation remains documentation-only with no fabricated Docker service.

## Completed signed-in acceptance and selected verification

- Released CodeShip1.0.18 `verify automation` acquired/released the canonical shared lock and recorded `verification:passed` at2026-11-19T02:58:09.320UTC, run `2026-11-19T02-57-46-219Z`. This supersedes the earlier busy-lock limitation.
- A separate saved-account browser session loaded Overview, live Queue,11-run history and saved accepted review detail. Each route was measured at360/768/1920 only after its real data appeared, not after a fixed sleep. All12 measurements had a visible workspace canvas, loaded content and document/body width equal to viewport; no browser error entries. Queue showed Online/Connected with0 pending/0 running,7 succeeded/4 failed. Existing review/step evidence remained intact; no jobs/reviews were inserted.
- Credentials stayed in browser-process memory, with no password/credential/grant changes. Normal Sign out completed; reloading the protected detail route remained signed out with no user menu. Viewport override reset. Metrics and screenshots retained under `.archive/automation-worker-release/automation-authenticated-layout-20261119.json` and `automation-{overview,history}-{360,768,1920}.jpg`.
- Geometry exposed a route-wrapper mistake: Overview/Queue also inherited the governed90% `.workspace-list-content`. At1920, canvas1610px/Overview content1449px; at360,360px/324px. The90% rule itself is intentional for record lists per master-list-standard.md, and is not globally overridden.
- Following supervisor direction, candidate1.0.9 changes only app wrapper selection: Overview/Queue use `w-full min-w-0 space-y-5 p-4 sm:p-6`; other pages keep `workspace-list-content min-w-0 space-y-5`. This is the existing shared-layout consumer pattern, not an app CSS margin patch. Source preparation is isolated from the canonical Zetro sidecar edits, which remain untouched. Existing approved dependency pins and all migration files are unchanged.
- Candidate1.0.9 local verify passed (13 tests, typecheck, build1.39s and versions). Published immutable tag `v-1.0.9`, commit `8a2f98b1bb56630ff92811e57a73467836eb7a58`; workflow44449201758 succeeded and CodeShip prepared the approved release set. Selected update is waiting on Codeitz's live operation lock; no lock bypass/deletion and no sibling operation interrupted.1.0.8 remains the last verified deployed release until the selected update and repeated measurements succeed.
- Canonical source was fast-forwarded to the published dashboard correction. Auto-merge needed reconciliation of two appended work-record sections; both the dashboard record and complete pending Zetro source-only note were retained. Original sidecar code diff was verified unchanged and remains unstaged. The isolated1.0.9 tag contains no sidecar import/assistant property or unapproved dependency pin.

## Final1.0.9 deployment and acceptance

- Published tag `v-1.0.9`, source commit `8a2f98b1bb56630ff92811e57a73467836eb7a58`; [workflow44449201758](https://github.com/CODEXSUN/automation/actions/runs/44449201758) succeeded.13 app tests passed in1.239s; all5 real PostgreSQL/BullMQ tests passed in15.768s. Hosted125-request overload fixture had1 accepted/124 controlled429, zero transport retries and603ms measured work. PG startup recovered in2 attempts/378ms; the Redis recovery sequence retained/completed2 fixture jobs in6.131s. These are disposable CI fixtures, not live job mutations.
- [Immutable release manifest](https://github.com/CODEXSUN/automation/releases/download/v-1.0.9/release-manifest.json): running image/digest `ghcr.io/codexsun/automation@sha256:c861be3b9fe71ea624521308491c784af2ae5163ffe2c55a3098b31b6bafea5a`, image ID `sha256:c861be3b9fe71ea624521308491c784af2ae5163ffe2c55a3098b31b6bafea5a`. Selected app update through released CodeShip tooling succeeded2026-11-19T03:22:57.515UTC. Service credential preserved; migration skipped, workerRedis/private network/Platform admission/release passed. All three migration definitions and approved dependency pins remain unchanged, so no new backup/migration/reset/seed was performed.
- Canonical selected `verify automation` through released CodeShip1.0.20 passed after Billing's verification gap; lock released normally. No sibling deployment, lock deletion, native scheduler/process interruption or whole-stack action. The earlier1.0.8 standalone verify at02:58:09UTC is retained separately.
- A fresh saved-account browser session on actual1.0.9 loaded Overview, live Queue,11-run history and saved accepted-review detail at360/768/1920. All12 checks had real content/canvas, visible1.0.9, expected geometry and document/body width exactly equal to viewport; zero browser error entries. Overview content fills available360/458/1610px with16px mobile/24px wider padding. Queue fills its available345/458/1610px (mobile vertical-scrollbar gutter accounted for). Run-history content stays at governed90%:311/399/1449px of345/443/1610px available; list/header implementation unchanged. Detail/review evidence remains loaded and readable.
- Final runtime snapshot:11 runs,2 reviews, fresh worker heartbeat, redis_ready=true. No live job or review was inserted. Both temporary browser sessions were signed out normally and protected-page reloads remained signed out; no credential/grant/password changes or secrets in reports. Viewport overrides reset. Authenticated evidence: `.archive/automation-worker-release/automation-1.0.9-authenticated-layout.json`, screenshots `automation-1.0.9-{overview,history}-{360,768,1920}.jpg`.
- Source canonical checkout now contains the approved1.0.9 correction. Concurrent Zetro sidecar code and its complete work-record note remain preserved/unpublished; they are excluded from this release. Their separately owned future dependency adoption is not an outstanding blocker to1.0.9. Execution0.2.1 remains the already-tested immutable vendor artifact; empty foundation scaffolds still have no fabricated Docker services.
- No remaining blocker for the assigned dashboard verification/correction/deployment. See `deployments/local-automation-1.0.9.md` for the concise actual deployment record.

## Subsequent availability check — 03:50UTC

Docker Linux engine became unavailable after the completed release and checks; Automation readiness now returns connection refused (`ECONNREFUSED`). Supervisor independently confirmed the shared-host outage and paused live operations. Last durable Automation stage remains successful selected CodeShip1.0.20 verification at2026-11-19T03:27:03.662UTC, with no partial deployment. Previous health/data/browser results remain timestamped historical evidence. Current live health is unavailable until the shared infrastructure owner restores the engine. No engine restart, cold boot, lock deletion, sibling action or deployment retry was performed.

Subsequent engine-recovery reconciliation: Automation is running/healthy on the unchanged approved1.0.9 digest, sole loopback14395 binding; readiness and health both200. Saved release/stage records show no partial Automation operation. Fresh read-only PostgreSQL snapshot retains11 run identities. This recovery check did not redeploy, alter locks, restart services or issue a load-test burst; the previous outage statement describes that earlier interval.
