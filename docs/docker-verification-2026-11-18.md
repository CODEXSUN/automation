# Local Docker verification — 2026-11-18

## Result

**Partial pass; not an end-to-end green Redis-backed automation deployment.** PostgreSQL and manual audit execution work. Redis works as a separate infrastructure service, but Automation has no Redis/BullMQ adapter or configured Redis connection. Its deployed container runs the API without a persistent worker. A separate test also reproduced rejection of jobs whose creator is a Platform actor.

This was verification, not a rollout: no image replacement, package installation in containers, infrastructure restart, account change, migration of deployed application data or Git publication was performed. Three diagnostic audit jobs were intentionally added to the deployed history. Separate test-database records and the Redis smoke-test key were cleaned up.

## Deployment identity

- Container: `automation`, healthy, on private `applications_backend`; browser port bound to `127.0.0.1:4459`.
- Version: **1.0.4**; revision `72a41cfe0cbefa955e3e9fa2934ba2fdcaed26ac`, matching the checked-out source at verification.
- Image ID: `sha256:3e864eb87709e4959924e5902ff427c2607bc3cda8e5d0db81961a13056cb9db`.
- CodeShip's managed application verification passed, including its runtime identity/readiness/origin/network/metrics checks.
- Process inspection found the CodeShip wrapper and API server, with no `scripts/worker.ts` process.

## Test results

| Check | Result | Evidence / limit |
| --- | --- | --- |
| Deployed liveness and readiness | PASS | Both HTTP 200 on port 4459 |
| Protected queue/history API without login | PASS | HTTP 401; no records disclosed |
| Setup audit and package/changelog versions | PASS | Deployed 1.0.4 checks passed |
| Deployed TypeScript check | PASS | `docker exec automation npm run typecheck` |
| Native app/tool tests | PASS | 10/10 |
| Deployed app/tool tests | PARTIAL | 9/10; GitHub-helper fixture cannot spawn Git (`ENOENT`) because Git is absent from the runtime image |
| Authenticated app PostgreSQL query | PASS | Database/role `app_automation`; audit tables and stored history queryable |
| Runtime database role restrictions | PASS | Neither superuser nor BYPASSRLS |
| Migration status | PASS | `20261118000100_audit_runs` already applied; no deployed migrations executed |
| PostgreSQL queue integration suite inside deployed image | PASS | Dedicated `automation_local_test`; duplicate acceptance, conflict, single-active claims, green/red history, cancellation, interruption and API guards passed |
| Original native test-database path | FAIL | Connection timeout at its configured loopback 5433 target; this was not treated as a production PostgreSQL failure |
| Live manual quick audit | PASS | `v7raeu3m`, 364 ms execution, both steps succeeded |
| Live manual quality audit | PASS | `92j59tev`, 1900 ms execution, all three steps succeeded |
| Live intentional failure probe | PASS | `f2i4093a`, failed with `exit-nonzero`, correctly persisted red |
| Redis authenticated PING | PASS | PONG using saved CodeShip credentials without revealing them |
| Redis persistence/memory settings | PASS | AOF enabled; `maxmemory-policy=noeviction` |
| Redis isolated enqueue/dequeue smoke | PASS | Unique `verification:automation:*` key; RPUSH/LPOP round trip, TTL safety and deletion of its own key |
| Automation Redis/BullMQ integration | NOT IMPLEMENTED | No Redis connection configured and no BullMQ/Redis-client dependency in deployed manifest |
| Automatic processing of newly accepted jobs | NOT AVAILABLE | No persistent worker deployed; tests invoked `jobs:work` explicitly |
| Platform-authored job execution | FAIL | Dedicated test job with a synthetic Platform-style actor was rejected by the worker's fixed local-actor check; status remained running with zero steps |

The deployed PostgreSQL history contained six runs before testing and nine afterward: six succeeded, three failed, no pending/running jobs. The additional failed job is the intentional failure probe. The synthetic actor diagnostic used only the separate test database and was removed there; it did not leave a blocked job in deployed history.

## Database test isolation

The host's original test connection timed out. The same suite was then executed from the deployed Automation image against the existing dedicated `_test` database through a temporary loopback-only TCP bridge inside the test process to private PostgreSQL. The test still used the dedicated test credentials and `NODE_ENV=test`, honoring the application's loopback/test-name checks. The temporary bridge closed afterward. No deployed app connection was redirected and no production tables were reset or used for destructive integration tests.

## Findings to address before claiming all-green

1. **Worker authorization mismatch:** API enqueue stores the authenticated Platform actor (`tenant:user`), while `workOnce` accepts only `automation-local-operator`. Define and verify trusted queued authorization and actor attribution; preserve the original creator rather than replacing it to evade this check. Test real granted/denied/revoked actor paths before deployment.
2. **Missing worker lifecycle:** CodeShip's deployed definition starts the API only. A worker needs an explicit managed runtime, correct scope/credentials, health/heartbeat, concurrency and shutdown behavior. Merely starting another process manually would not verify managed deployment.
3. **Redis is separate from this queue:** Automation and Redis are currently attached to different private Docker networks. Select and implement the intended PostgreSQL delivery mode or Redis/BullMQ adapter, with scoped private connectivity, durable acceptance and coordinated recovery. Do not equate a standalone Redis PING or list smoke test with integrated BullMQ delivery.
4. **Runtime test prerequisite:** Run the Git-dependent release-tool fixture in a suitable build/test environment, or explicitly classify it as a developer-tool test. Do not claim the unchanged runtime image passed all ten tests or install Git into the running image to mask the issue.
5. **Native test connectivity:** Inspect the native development connection separately. The isolated in-image integration suite passed, but that does not repair the timed-out original host path.

Changes to these runtime behaviors should be implemented, tested, released and installed through CodeShip's governed tagged-release process. No such fixes or deployment changes were included in this verification task.
