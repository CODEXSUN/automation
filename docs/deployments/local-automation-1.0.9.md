# Automation1.0.9 verified local deployment — 2026-11-19

Result: deployed and verified at `http://127.0.0.1:14395`, sole binding14395:4395. This is the narrow correction from an all-page list wrapper to full-width padded Overview/Queue. Governed90% list/detail layout remains intact. No shared CSS override or sidecar feature ships in this release.

- Source/tag: `8a2f98b1bb56630ff92811e57a73467836eb7a58`, `v-1.0.9`.
- Successful workflow: [44449201758](https://github.com/CODEXSUN/automation/actions/runs/44449201758),13 app tests plus5 real PG/BullMQ tests passed.
- Approved/running digest and image ID: `sha256:c861be3b9fe71ea624521308491c784af2ae5163ffe2c55a3098b31b6bafea5a`.
- Selected CodeShip update succeeded03:22:57.515UTC. Credential preserved; no pending migration; workerRedis, private network, readiness/image/origin/metrics checks and Platform admission passed. Released CodeShip1.0.20 selected verification subsequently passed and released its lock normally.
- No schema, migration-definition or dependency-pin changes. No reset, seed, native process/scheduler change, shared-service restart or sibling rollout. Existing1.0.8 checked recovery archive/restore evidence remains retained; a new backup was not required for this image-only update.
- Actual signed-in Overview, Queue, history and saved reviewed detail passed at360/768/1920:12 loaded-data checks, visible workspace canvas/version, zero document overflow and zero browser errors. Dashboard wrapper matches100% of available parent width with16/24px padding; records keep90% and existing header behavior. Screenshots and exact geometry are retained under `.archive/automation-worker-release/automation-1.0.9-*`.
- PostgreSQL still has11 runs and2 reviews; worker heartbeat fresh and Redis connected. No live diagnostic job/review was created. Test sessions signed out and stayed revoked on protected-page reload; no credentials or grants changed.
- Concurrent canonical Zetro-sidecar code and source-only work-record note were retained outside this release. Canonical source was fast-forwarded and its original pending sidecar diff verified preserved; no unapproved sidecar dependency was pinned or published.

Full before/after measurements, CI timings, previous1.0.8 acceptance and current identity are in `../supervisor-audit-20261119.md`. The two original verification gaps are complete; no assigned deployment/viewport blocker remains.

## Subsequent shared-host outage

At 2026-11-19T03:50UTC, a fresh check found the Docker Linux engine unavailable and Automation readiness refused the connection (`ECONNREFUSED`). The supervisor independently confirmed the shared engine outage. The successful deployment and acceptance above are historical evidence, not a claim of current availability. Last durable selected verification passed at03:27:03.662UTC through CodeShip1.0.20; no partial Automation deployment remains. Live operations are paused pending shared-host restoration by its owner. No engine restart, cold boot, lock removal or sibling operation was attempted.

After the supervisor reported engine recovery, read-only reconciliation confirmed Automation running/healthy on the same approved1.0.9 digest and sole loopback14395 binding. Both `/api/ready` and `/api/health` returned200. The saved release pointer and final stages remain the successful03:22 deployment and03:27 verification; no interrupted Automation operation exists. A fresh read-only PostgreSQL identity snapshot retained11 run identities. No restart, redeployment, lock modification or load-test burst was performed by this app owner.
