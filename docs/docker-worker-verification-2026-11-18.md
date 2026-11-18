# Managed worker and review verification — 2026-11-18

Automation 1.0.6 was installed through CodeShip from successful tagged CI at commit `af73d2162aa7f2194a5db56cc1044aca2afb74c2`. Approved image: `ghcr.io/codexsun/automation@sha256:5d6211ace01624fe21b0d76675f7317a8736ca70127a4e879c3d731c615f35dd`. The local origin remains `http://127.0.0.1:4459`.

## Deployment and checks

CodeShip retained the previous configuration, quiesced Automation, retained a PostgreSQL custom backup and checked its archive listing before applying the additive worker/review migration. Backup SHA-256: `547bc4b460866f808150e425cdffa79b18bc153d33ba22038f5d45f118c09c0d`. Archive readability is not a restore rehearsal. Migration, private scoped Redis account, application replacement, readiness and Platform admission passed; release succeeded at 17:26:36 UTC.

| Check | Actual result |
| --- | --- |
| Installed-image app/tool/auth tests | 11 passed, including the previously missing Git fixture prerequisite |
| Installed-image typecheck, setup audit, version check and migration status | Passed |
| Installed-image dedicated PostgreSQL integration | Passed: idempotency, conflicts, one active job, cancellation, interrupted leases, green/red history and API guards |
| Installed-image real Redis/BullMQ integration | Passed: automatic delivery, immutable creator, denied authorization, heartbeat and separate review history |
| Anonymous run API | 401; no history disclosed |
| Scoped Redis foreign-key access and CONFIG | Both denied with NOPERM |
| Targeted Automation Redis-user outage | Readiness became 503; shared Redis was never stopped |
| Restoring that account | Worker reconnected and readiness returned 200 |
| Managed Automation container restart | API and worker became ready; all nine pre-existing audit IDs retained |
| Signed-in quality audit `28zn2i9m` | Automatically succeeded; three steps, 2065 ms queue wait, 2691 ms execution |
| Signed-in intentional failure `hvm8pels` | Automatically failed as intended; 444 ms queue wait, 510 ms execution; exit-nonzero retained |
| Accepted and Needs attention reviews | Saved with the original signed-in reviewer and timestamp; execution status unchanged |
| Reload and review inbox | Reviews persisted; both reviewed jobs excluded from inbox; nine older unreviewed jobs remained |
| Unsaved review navigation | Stay/discard prompt appeared; Stay preserved the note |

The browser session was supplied by the user. No password, grant, credential flag or account was changed by this verification. Two diagnostic production runs and their review records were intentionally retained: history grew from nine to eleven, with seven succeeded and four failed, no pending/running jobs. A failed fixture is expected evidence, not a failed test.

## Procedure and limits

1. Publish a fresh app tag using its GitHub helper; wait for successful CI and a release manifest.
2. Prepare an explicit release set through CodeShip. Wait for its exclusive operation lock; preserve concurrent app updates.
3. Run the CodeShip Automation update. Check migration backup, additive migration, scoped Redis, image identity, readiness and Platform admission stages.
4. CodeShip's `scripts/verify-automation-docker.ts` runs installed-image suites using the dedicated `_test` database and a temporary queue-only Redis account. Test connection values stay private. The `--infrastructure-only` mode tests scoped ACL denial, targeted outage/reconnect, restart and preserved history without a human session.
5. Sign in normally for browser job/review checks. Honor required password changes; never reset credentials or grant access to make a test pass.
6. Retain version/image IDs, backup reference, private JSON check reports and concise outcomes. Do not reset production tables or restart shared PostgreSQL/Redis.

The unattended protected-API scenario stopped honestly at the saved SA account's required password update; the user's separate signed-in browser verified actual job execution and reviews. The extended live queue-during-outage/session-logout scenario was not run; authorization denial and recovery are covered separately by the database suite, Platform tests and targeted runtime checks. An HTTP detail request required one visible Retry and then succeeded. The initial host verifier reused a stale keep-alive connection across blocking container tests; using closed connections fixed that verifier failure. Neither was hidden as an initial all-pass run.

Four inherited high dependency audit findings remain in the existing Vite dependency chain; functional test success is not a clean security audit or VPS certification.

## Final review correction

The 1.0.6 browser audit found that only Failure probe was disabled with an unsaved review note. Quality and Quick now receive the same protection in fresh patch 1.0.7. This changes no database migration or worker contract. Its tagged CI and managed image-only update must pass before claiming 1.0.7 installed.
