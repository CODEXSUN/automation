# automation tagged release

The matching docs/CHANGELOG.md records product changes. Builds use published, immutable sibling pins; application secrets and runtime data are excluded. CodeShip owns installation, migration planning, checked recovery backups when migrations are pending, image replacement and verification. Product shell entries delegate to CodeShip.

An image release is not an installation certificate. Installation requires the reviewed automation runtime/database adapter and Platform service/tenant registration; unsupported targets stop before changes. Never bypass authentication, reset data or reuse another app's database to make readiness pass.

## Managed worker and review

Adds automatic Redis/BullMQ delivery, per-step Platform authorization, worker heartbeat, append-only human review and an operator Review inbox. A new additive audit migration requires CodeShip writer quiescence and a checked PostgreSQL backup. Requires the Platform worker-context release and the updated CodeShip Automation adapter. Existing runs and steps are retained.
