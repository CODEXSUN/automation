# automation tagged release

The matching docs/CHANGELOG.md records product changes. Builds use published, immutable sibling pins; application secrets and runtime data are excluded. CodeShip owns installation, migration planning, checked recovery backups when migrations are pending, image replacement and verification. Product shell entries delegate to CodeShip.

An image release is not an installation certificate. Installation requires the reviewed automation runtime/database adapter and Platform service/tenant registration; unsupported targets stop before changes. Never bypass authentication, reset data or reuse another app's database to make readiness pass.

## Managed worker and review

Adds automatic Redis/BullMQ delivery, per-step Platform authorization, worker heartbeat, append-only human review and an operator Review inbox. A new additive audit migration requires CodeShip writer quiescence and a checked PostgreSQL backup. Requires the Platform worker-context release and the updated CodeShip Automation adapter. Existing runs and steps are retained.

## 1.0.7 review action correction

All three audit actions now wait until a review note is saved or cleared. This is an image-only correction with no new migrations. CodeShip installed 1.0.7 after successful tagged CI; readiness, Platform admission and browser action guards passed. Worker/review Docker evidence and the blocked final installed-image repeat are recorded in `docker-worker-verification-2026-11-18.md`.
