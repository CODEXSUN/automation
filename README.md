# Automation

Automate our business.

Independent automation product with a local PostgreSQL audit queue, durable run/step history and a shared UIUX desk. Quick/quality audits work without Zetro, AI credentials or Redis. A failure-probe variant verifies that errors stay red.

## Local development

Read [governance](../../mcp-governance/docs/governance.md) and the [local audit operating process](docs/local-audit-process.md). Prepare shared framework/UI dependencies in their owners; Execution is included as a reviewed package artifact under vendor. Install here, configure the dedicated local PostgreSQL connections through CodeShip, and explicitly run `npm run db:migrate`. Run `npm run verify` and `npm run test:database`, then `npm run dev:api` / `npm run dev:web` in separate terminals and `npm run worker` in another. Web/API ports are 4390/4395; built `npm start` serves both on 4395.

`npm run build` automatically runs the read-only `setup:audit` prebuild gate. It fails on missing governance/shared builds/contracts/tools or inconsistent versions. It never installs dependencies, changes versions, migrates databases, stops services or calls AI. Use `npm run github:audit`, `npm run check:versions` and `npm run version:preview -- --no-database-update` for read-only checks. The generated GitHub/version tools also support explicit mutation commands documented in [repository tools](docs/repository-tools.md); publishing is not part of setup or build.

The Automations tool catalog is code-owned. Run history provides Quick audit, Quality audit and Failure probe actions, real persisted details, step results and timings. Queue shows stored state counts. Local Host, Origin and peer guards protect the APIs; mutation endpoints accept fixed variants rather than scripts or shell commands. This is a local development boundary, not production authentication or per-person identity. Do not expose it publicly. `/api/docs` describes the operations. `/api/ready` now verifies the audit table is queryable; it does not certify a worker heartbeat.

## Standalone ownership and packaging

This directory owns its Git repository, manifest, lockfile, contracts, release tools and build. It is not an npm workspace member. Framework/UI sibling `file:` references are development dependencies only. Relocation requires verified packages for those two owners, a governance instruction link, `AUTOMATION_GOVERNANCE_PATH`, and a reviewed local database connection. Execution is included as a reviewed artifact with its digest in vendor/README.md. A relocated clean-room install is not yet verified.

## Services and next phase

PostgreSQL is required by the job API/worker. Optional Redis configuration is unused by this database delivery variant. The overview reports configuration presence; readiness checks actual storage. Never enter credentials into catalog/job records. The development role is a dedicated non-superuser database owner; production runtime/migration role separation remains pending.

Next: versioned configurable workflow definitions, production trusted identity, worker heartbeat, retention policy and an explicitly coordinated Redis/BullMQ delivery adapter if required. Do not run competing SQL/Redis consumers or substitute SQLite for durable records. See the historical [phase-one contract](docs/phase-one.md) and current [operating process](docs/local-audit-process.md).
