# automation tagged release

## 1.0.9 dashboard container correction

Overview and Queue now use the existing full-width padded dashboard pattern; record lists and review detail retain their governed list alignment. No shared CSS override, dependency upgrade, migration, job mutation or sidecar feature is included. CodeShip should perform an image-only selected Automation update if its actual migration plan confirms none pending. Existing1.0.8 signed-in and managed verification evidence remains recorded separately;1.0.9 requires its own successful workflow, image identity and loaded360/768/1920 checks.

## 1.0.8 bounded fair delivery and recovery

Adds bounded HTTP acceptance, transactional100/installation and8/requester pending limits, least-recently-served requester dispatch, safe idempotent replay at capacity and a requester-dispatch index. API and worker remain separate supervised processes; per-step Platform authorization remains authoritative. Execution0.2.1 batches at most100 public references, bounds producer commands and reconnect delay and forbids automatic repeat starts. Shared framework0.2.0 handles read-only dependency startup; idle PostgreSQL socket failures no longer terminate the app.

CodeShip must take a checked backup and apply only new migration `20261119000100_queue_fairness`. It adds an index without rewriting rows or existing migration files. Preserve history, grants, service credentials, native schedulers and other containers. Docker port contract is14395:4395; CodeShip must verify its actual4395 private ingress listener and preserve the existing private relay/Host/Origin/grant checks. No independent rollout is performed by this owner.

See `supervisor-audit-20261119.md` for exact tests, timings, immutable pins, release identity, limits and CodeShip handoff. Source publication alone does not certify deployment or a100-user production soak.

The matching docs/CHANGELOG.md records product changes. Builds use published, immutable sibling pins; application secrets and runtime data are excluded. CodeShip owns installation, migration planning, checked recovery backups when migrations are pending, image replacement and verification. Product shell entries delegate to CodeShip.

An image release is not an installation certificate. Installation requires the reviewed automation runtime/database adapter and Platform service/tenant registration; unsupported targets stop before changes. Never bypass authentication, reset data or reuse another app's database to make readiness pass.

## Managed worker and review

Adds automatic Redis/BullMQ delivery, per-step Platform authorization, worker heartbeat, append-only human review and an operator Review inbox. A new additive audit migration requires CodeShip writer quiescence and a checked PostgreSQL backup. Requires the Platform worker-context release and the updated CodeShip Automation adapter. Existing runs and steps are retained.

## 1.0.7 review action correction

All three audit actions now wait until a review note is saved or cleared. This is an image-only correction with no new migrations. CodeShip installed 1.0.7 after successful tagged CI; readiness, Platform admission and browser action guards passed. Worker/review Docker evidence and the blocked final installed-image repeat are recorded in `docker-worker-verification-2026-11-18.md`.
