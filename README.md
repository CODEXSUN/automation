# Automation

Automate our business.

Independent automation product. Deterministic tools do not require Zetro or any AI credentials. Phase one provides the shared UIUX Overview and Automations catalog, local read-only APIs and audited repository tooling. It does not yet persist workflow definitions or dispatch background jobs.

## Local development

Read [governance](../../mcp-governance/docs/governance.md). Build `foundation/framework` and `packages/ui` in their own repositories first, then run `npm install` here. Run `npm run verify`, `npm run preflight`, then `npm run dev:api` and `npm run dev:web` in separate terminals. Open http://127.0.0.1:4390. API is 4395; built `npm start` serves the desk and API together on 4395.

`npm run build` automatically runs the read-only `setup:audit` prebuild gate. It fails on missing governance/shared builds/contracts/tools or inconsistent versions. It never installs dependencies, changes versions, migrates databases, stops services or calls AI. Use `npm run github:audit`, `npm run check:versions` and `npm run version:preview -- --no-database-update` for read-only checks. The generated GitHub/version tools also support explicit mutation commands documented in [repository tools](docs/repository-tools.md); publishing is not part of setup or build.

The Automations page deliberately has no New/Edit/Run action: its first catalog is code-owned and CLI-only. Local Host, Origin and peer guards protect its read-only API. This is a local development boundary, not production authentication or tenant identity. Do not expose the server publicly. `/api/docs` describes the two catalog APIs. `/api/ready` currently certifies only the framework process, because no database/queue adapter is registered.

## Standalone ownership and packaging

This directory owns its Git repository, manifest, lockfile, contracts, release tools and build. It is not an npm workspace member. Local sibling `file:` references are development dependencies only. To move the app, build and pack framework and UI in their owners, distribute both verified tarballs, replace both dependency references with their tarball paths and install here. Inspect UI tarball contents and licenses and verify the relocated build; framework alone is insufficient. Update AGENTS.md's governance link to the agreed location and set `AUTOMATION_GOVERNANCE_PATH` for the audit. A relocated clean-room install is not yet verified.

## Services and next phase

No database or Redis credential is required by this first read-only desk. Optional connection variables are documented in `.env.example`; the UI reports configuration presence without contacting either service. Never enter credentials into catalog records.

Next: provision a dedicated least-privilege database/account through Codeship, implement trusted identity, module migrations and durable run/outbox state, then add Execution-owned BullMQ workers and recovery. PostgreSQL retains accepted work during Redis outages; no SQLite substitution or competing SQL worker is implied. See [phase-one contract](docs/phase-one.md).
