# Managed delivery and human review

Automation keeps accepted jobs, authorization references, step outcomes and human reviews in PostgreSQL. Redis/BullMQ carries only public run references. The managed worker reconciles pending database records every two seconds; a Redis outage leaves those records durable. One audit executes at a time. Duplicate delivery cannot claim a terminal run or overwrite prior step evidence. Abandoned executions become interrupted after their lease expires and require an explicit new run; they are not blindly repeated.

## Authorization

The API captures tenant, user and session references only from the verified Platform request. Creator attribution is immutable. Before every step the worker authenticates its service to Platform's `/api/v1/internal/worker-context` decision endpoint. Platform resolves the current session and user, checks active tenant/app installation, service audience, password requirements and explicit `automation/operator:write` permission. Invalid, expired or revoked authority records a failed authorization outcome with no script execution. No stored session reference or Redis payload grants authority, and no browser token or service credential is put in job records. Legacy local-actor records can be exercised in isolated tests; production workers do not impersonate that actor.

## Human desk

- **Overview:** product context and entry points to the operating pages.
- **Automations:** fixed tool catalog; queued variants run allowlisted read-only scripts. Version mutation, arbitrary shell and publication remain explicit operator operations.
- **Run history:** requester, execution state, queue wait, duration and latest human review. View a run for ordered step evidence and authorization outcome.
- **Review inbox:** completed runs in the latest 100-record history without a human decision. It is not a server-wide paginated backlog.
- **Run detail:** append an Accepted or Needs attention decision and a note. Decisions retain reviewer/time and prior decisions. They never turn a failed execution green or authorize another run. Notes must not contain credentials or private customer records.
- **Queue:** durable state counts, live worker heartbeat, Redis readiness and last observation time. Offline/stale status remains visible.

Reads and writes retain Platform permissions and tenant binding; review writes require operator-write permission. The frontend does not copy database rows, authorization session references or credentials. All controls use public shared UIUX components.

## Managed runtime and recovery

CodeShip runs the API and BullMQ worker under the Automation container's supervisor. A child failure ends the supervised runtime so Docker can restart it. Shutdown stops new work and drains bounded audit steps. Readiness checks PostgreSQL plus fresh worker/Redis heartbeat in the Docker profile. The image includes Git so developer-tool fixture tests can run unchanged in the deployed test environment.

CodeShip creates a distinct Redis user for the fixed installed tenant, persists its encrypted recovery credential before effects, adds its hash to the persistent Redis ACL file and scopes keys/channels to the Automation queue namespace. It does not reuse the Redis administrator password in the app. It attaches shared Redis privately without adding a public port or changing other service accounts. Both the app image and worker use the same reviewed release; no source bind mount or Docker socket is granted.

The new `20261118000200_worker_reviews` migration preserves all existing runs/steps and adds authorization metadata, outcome reasons, worker heartbeat and append-only review history. CodeShip quiesces the existing app and takes a checked PostgreSQL backup before applying it. Migration files already published are unchanged. No reset, seed, history deletion or automatic database downgrade is part of update.

## Verification

Run `npm run verify`. Run `npm run test:database` against a dedicated `_test` PostgreSQL target; set `AUTOMATION_TEST_REDIS_URL` to include the real BullMQ delivery tests. Tagged Automation CI supplies both disposable services and runs both database suites. The Redis suite verifies actor preservation, allowed and denied dispatch, terminal results and separate human-review records. Platform has its own worker-decision and existing gateway/database regression tests. Test outage/recovery only on an isolated test queue or targeted app worker; never stop shared PostgreSQL/Redis merely to manufacture a green check.

Release and install with fresh tags through CodeShip's explicit release-set workflow. Record installed versions, source revisions, preserved history and actual Docker/browser results in the work record. A successful source build alone is not a deployed verification result.
