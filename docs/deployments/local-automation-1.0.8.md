# Automation 1.0.8 local Docker audit — 2026-11-19

Result: latest stable release is already deployed and healthy. This audit retained the matching deployment rather than replacing it again.

## References and release identity

- Followed Central Governance, MCP execution, tagged releases and CodeShip's application adapter guidance. MCP governance is a development contract; no new runtime MCP registry or authorization service is claimed.
- Used the released CodeShip1.0.18 operator under `devkit/codeship/.codeship/operators/v-1.0.18`, preserving the editable CodeShip checkout and other owners' work.
- GitHub latest stable release: `v-1.0.8`; source commit `d0bd54c42142a373051c85f62a4cf5c75e45e37d`; successful workflow44434505621 and release manifest independently verified.
- Running approved image: `ghcr.io/codexsun/automation@sha256:54163c3441276695cf618accd9467e712e5fdab57678e8de778d1b4d4c9226e0`. Docker image ID matches that digest; health is healthy.
- Sole host binding: `127.0.0.1:14395:4395`. Old4459 is closed. Browser address: `http://127.0.0.1:14395`.

## Deployment evidence already recorded by CodeShip

The selected update succeeded at2026-11-19T01:47:10Z (07:17:10IST). The pending fairness index required API/worker quiescence, checked PostgreSQL backup and explicit migration. Migration, scoped worker Redis, private network and Platform admission passed before the successful release pointer was saved.

Backup SHA-256: `1cb469111adb1fbf29390b01e9e9e35c32fe4b0f14173530f8ef04c0f9fda2cd`. CodeShip subsequently restored that exact archive into its separate owned temporary database; all11 audit-run public identities matched. The temporary database was removed after its ownership marker was independently checked. Private evidence: `.codeship/verification/automation-restore-rehearsal-20261119.json`. Live application data was untouched by the rehearsal.

## Current read-only checks

| Check | Result |
| --- | --- |
| Liveness, readiness and frontend | HTTP200 |
| Browser landing page | Automation sign-in form rendered on14395 |
| Anonymous run/history API | HTTP401 |
| Foreign browser Origin on session API | HTTP403 |
| Released CodeShip independent-network validator | Passed; independent container/ports retained |
| Approved image, Compose project and health | Matched applications/Automation1.0.8; healthy |
| CodeShip app metrics | Fresh; Automation present in applications group |
| Worker heartbeat and Redis | Fresh heartbeat; redis_ready=true |
| Fairness index | `audit_runs_requester_dispatch` exists |
| Existing audit history |11 runs, matching the recorded deployment baseline count |
| Managed runtime processes | Init plus four Node processes (bridge, supervisor, API and worker) present |

The write-recording `verify automation` CLI was attempted but refused another app's exclusive operation lock. A bounded waiter also left that lock untouched. The current audit therefore used the released CodeShip pure network/identity validator and read-only HTTP/metrics/database checks; it does not claim a newly appended managed verification stage. The earlier selected deployment success and restore evidence remain intact.

No image replacement, migration rerun, password/grant change, diagnostic job insertion, native scheduler change, shared-service restart or sibling deployment occurred in this audit. Authenticated dashboard/viewport and transaction checks were not repeated without a signed-in browser session. The immutable release's13 app tests and5 PostgreSQL/BullMQ integration tests passed in hosted CI; those are separate from the current operational audit.
